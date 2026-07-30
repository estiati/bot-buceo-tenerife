import os
import json
import logging
import threading
from flask import Flask
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes
from consultar_mar import obtener_datos_marinos
from evaluador import evaluar_inmersion  # <-- CORREGIDO: Importación actualizada

# Servidor web Flask para que Render mantenga el Web Service activo
app_web = Flask(__name__)

@app_web.route('/')
def home():
    return "Bot de Buceo Tenerife Activo"

def run_web():
    app_web.run(host='0.0.0.0', port=8080)

def keep_alive():
    t = threading.Thread(target=run_web)
    t.daemon = True
    t.start()

# Configuración del bot de Telegram
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# TOKEN seguro a través de variables de entorno
TOKEN = os.getenv("TELEGRAM_TOKEN")

def cargar_zonas():
    with open("zonas_tenerife.json", "r", encoding="utf-8") as f:
        # Cargamos directamente el diccionario completo con la nueva estructura
        return json.load(f)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Primer nivel: Selección de vertiente
    keyboard = [
        [InlineKeyboardButton("🌊 Vertiente Norte", callback_data="MENU_Norte")],
        [InlineKeyboardButton("🏖️ Vertiente Sur", callback_data="MENU_Sur")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    mensaje = (
        "🤿 *Meteo Buceo Tenerife*\n\n"
        "Selecciona la vertiente para consultar el estado del mar:"
    )
    
    # Maneja si viene de un comando /start o de un botón "Volver"
    if update.message:
        await update.message.reply_text(mensaje, reply_markup=reply_markup, parse_mode="Markdown")
    else:
        await update.callback_query.edit_message_text(mensaje, reply_markup=reply_markup, parse_mode="Markdown")

async def manejar_botones(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data
    
    zonas = cargar_zonas()

    # Si el usuario seleccionó una vertiente (Norte o Sur)
    if data.startswith("MENU_"):
        vertiente_elegida = data.split("_")[1]
        keyboard = []
        botones_fila = []
        
        # Filtramos y creamos botones para esa vertiente en 2 columnas
        for nombre_zona, datos in zonas.items():
            if datos.get("vertiente") == vertiente_elegida:
                botones_fila.append(InlineKeyboardButton(nombre_zona, callback_data=f"ZONA_{nombre_zona}"))
                if len(botones_fila) == 2:
                    keyboard.append(botones_fila)
                    botones_fila = []
        if botones_fila:  # Añadir el botón impar si queda suelto
            keyboard.append(botones_fila)
            
        # Botón para retroceder
        keyboard.append([InlineKeyboardButton("⬅️ Volver al menú principal", callback_data="VOLVER_INICIO")])
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(
            f"🗺️ *Zonas de la vertiente {vertiente_elegida}*\nSelecciona un punto:",
            reply_markup=reply_markup,
            parse_mode="Markdown"
        )

    # Si el usuario seleccionó una zona concreta
    elif data.startswith("ZONA_"):
        nombre_zona = data.replace("ZONA_", "")
        spot = zonas.get(nombre_zona)
        
        if not spot:
            await query.edit_message_text("Error: Zona no encontrada.")
            return
            
        await query.edit_message_text(f"⏳ Consultando condiciones en *{nombre_zona}*...", parse_mode="Markdown")
        
        # Extraemos las variables usando las nuevas claves 'lat' y 'lon'
        lat = spot["lat"]
        lon = spot["lon"]
        datos_mar = obtener_datos_marinos(lat, lon)
        
        if datos_mar:
            altura_ola = datos_mar.get("altura_ola", 0)
            periodo = datos_mar.get("periodo", 0)
            vel_corriente = datos_mar.get("vel_corriente", 0)
            dir_corriente = datos_mar.get("dir_corriente", 0)
            vel_viento = datos_mar.get("vel_viento", 0)
            dir_viento = datos_mar.get("dir_viento", 0)
            dir_ola = datos_mar.get("dir_ola", 0)

            # <-- CORREGIDO: Llamada al evaluador con el nombre correcto
            evaluacion = evaluar_inmersion(altura_ola, periodo, vel_corriente, dir_corriente, vel_viento, dir_viento)
            
            mensaje = (
                f"📍 *{nombre_zona}* (Vertiente {spot['vertiente']})\n\n"
                f"📊 *Datos Actuales:*\n"
                f"• Ola: {altura_ola} m ({dir_ola}°)\n"
                f"• Periodo: {periodo} s\n"
                f"• Viento: {vel_viento} km/h ({dir_viento}°)\n"
                f"• Corriente: {vel_corriente} kn ({dir_corriente}°)\n\n"
                f"📝 *Evaluación:* {evaluacion}"
            )
            
            # Botones para volver rápido sin teclear /start
            keyboard = [
                [InlineKeyboardButton(f"⬅️ Volver a {spot['vertiente']}", callback_data=f"MENU_{spot['vertiente']}")],
                [InlineKeyboardButton("🏠 Menú Principal", callback_data="VOLVER_INICIO")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(mensaje, reply_markup=reply_markup, parse_mode="Markdown")
        else:
            await query.edit_message_text("❌ Error al conectar con Open-Meteo. Inténtalo más tarde.")

    # Si el usuario quiere volver al principio
    elif data == "VOLVER_INICIO":
        await start(update, context)

if __name__ == "__main__":
    if not TOKEN:
        print("⚠️ CUIDADO: No se ha detectado el TELEGRAM_TOKEN en las variables de entorno.")
    else:
        keep_alive()  # Arranca el servidor web en segundo plano
        
        app = ApplicationBuilder().token(TOKEN).build()
        app.add_handler(CommandHandler("start", start))
        
        # Agrupamos todos los botones en un solo handler unificado
        app.add_handler(CallbackQueryHandler(manejar_botones))
        
        print("🤖 Bot arrancado y escuchando en Telegram...")
        app.run_polling()
