import json
import logging
import threading
from flask import Flask
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes
from consultar_mar import obtener_datos_marinos
from evaluador import evaluar_condiciones

# Servidor web Flask para que Render mantenga el Web Service activo
app_web = Flask('')

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

TOKEN = "8166813292:AAH5icH-BPew_RqPtCQnNf6B9PFpzqX7bhs"

def cargar_zonas():
    with open("zonas_tenerife.json", "r", encoding="utf-8") as f:
        return json.load(f)["zonas"]

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    zonas = cargar_zonas()
    keyboard = []
    for clave, datos in zonas.items():
        keyboard.append([InlineKeyboardButton(datos["nombre"], callback_data=clave)])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "🤿 *Meteo Buceo Tenerife*\n\n"
        "Selecciona una zona costera para consultar el estado del mar y las condiciones de buceo:",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

async def responder_zona(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    clave_zona = query.data
    zonas = cargar_zonas()
    spot = zonas.get(clave_zona)
    
    if not spot:
        await query.edit_message_text("Error: Zona no encontrada.")
        return
    
    await query.edit_message_text(f"⏳ Consultando condiciones en *{spot['nombre']}*...", parse_mode="Markdown")
    
    datos = obtener_datos_marinos(spot["latitud"], spot["longitud"])
    
    if datos:
        # Extraemos los datos con las claves correctas en español
        altura_ola = datos.get("altura_ola", 0)
        periodo = datos.get("periodo", 0)
        vel_corriente = datos.get("vel_corriente", 0)
        dir_corriente = datos.get("dir_corriente", 0)
        vel_viento = datos.get("vel_viento", 0)
        dir_viento = datos.get("dir_viento", 0)
        dir_ola = datos.get("dir_ola", 0)

        # Pasamos los argumentos individuales a evaluar_condiciones
        evaluacion = evaluar_condiciones(altura_ola, periodo, vel_corriente, dir_corriente, vel_viento, dir_viento)
        
        # Construimos el mensaje con los datos actualizados
        mensaje = (
            f"📍 *{spot['nombre']}*\n"
            f"ℹ️ _{spot['descripcion']}_\n\n"
            f"📊 *Datos Actuales:*\n"
            f"• Ola: {altura_ola} m ({dir_ola}°)\n"
            f"• Periodo: {periodo} s\n"
            f"• Viento: {vel_viento} km/h ({dir_viento}°)\n"
            f"• Corriente: {vel_corriente} kn ({dir_corriente}°)\n\n"
            f"{evaluacion}"
        )
    else:
        mensaje = "❌ Error al conectar con el servicio meteorológico."
        
    await query.edit_message_text(mensaje, parse_mode="Markdown")

if __name__ == "__main__":
    keep_alive()  # Arranca el servidor web en segundo plano
    
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(responder_zona))
    
    print("🤖 Bot arrancado y escuchando en Telegram...")
    app.run_polling()
