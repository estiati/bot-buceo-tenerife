def evaluar_condiciones(altura_ola, periodo, velocidad_corriente, dir_corriente=None, vel_viento=None, dir_viento=None):
    """
    Evalúa las condiciones del mar y viento para buceo recreativo/técnico.
    """
    # 0. SANEAMIENTO DE DATOS (Prevención de TypeErrors si la API devuelve strings o Nones)
    try:
        altura_ola = float(altura_ola) if altura_ola is not None else 0.0
        periodo = float(periodo) if periodo is not None else 0.0
        velocidad_corriente = float(velocidad_corriente) if velocidad_corriente is not None else 0.0
        vel_viento = float(vel_viento) if vel_viento is not None else 0.0
    except ValueError:
        return "❌ Error: La API meteorológica ha devuelto un formato de datos no válido."

    alertas = []
    
    # 1. EVALUACIÓN DE LA OLA (ALTURA)
    if altura_ola < 0.7:
        eval_ola = f"🟢 Mar llana / Rizada ({altura_ola:.2f} m). Entrada muy fácil."
    elif 0.7 <= altura_ola <= 1.2:
        eval_ola = f"🟡 Marejadilla ({altura_ola:.2f} m). Precaución en la orilla/rampa."
    else:
        eval_ola = f"🔴 Marejada ({altura_ola:.2f} m). Entrada complicada o peligrosa."
        alertas.append("Oleaje elevado")

    # 2. EVALUACIÓN DEL PERÍODO
    if periodo < 6.0:
        eval_periodo = f"🟡 Período corto ({periodo:.1f}s): Mar picada de viento. Superficie molesta."
    elif 6.0 <= periodo <= 9.0:
        eval_periodo = f"🟢 Período medio ({periodo:.1f}s): Condiciones aceptables."
    else:
        eval_periodo = f"🟢 Período largo ({periodo:.1f}s): Mar de fondo limpia y espaciada."

    # 3. EVALUACIÓN DE LA CORRIENTE
    if velocidad_corriente < 0.4:
        eval_corriente = f"🟢 Corriente floja ({velocidad_corriente:.2f} kn). Fácil navegación."
    elif 0.4 <= velocidad_corriente <= 0.8:
        eval_corriente = f"🟡 Corriente moderada ({velocidad_corriente:.2f} kn). Planificar inmersión a contracorriente a la ida."
    else:
        eval_corriente = f"🔴 Corriente fuerte ({velocidad_corriente:.2f} kn). Precaución."
        alertas.append("Corriente fuerte")

    # 4. EVALUACIÓN DEL VIENTO
    if vel_viento > 0:
        if vel_viento < 15.0:
            eval_viento = f"🟢 Viento flojo ({vel_viento:.1f} km/h)."
        elif 15.0 <= vel_viento <= 25.0:
            eval_viento = f"🟡 Viento moderado ({vel_viento:.1f} km/h). Puede incomodar en superficie."
        else:
            eval_viento = f"🔴 Viento fuerte ({vel_viento:.1f} km/h). Deriva y oleaje local agitado."
            alertas.append("Viento fuerte")
    else:
        eval_viento = "⚪ Viento: Sin datos o en calma"

    # 5. DETERMINACIÓN DEL ESTADO GLOBAL
    if "🔴" in eval_ola or "🔴" in eval_corriente or "🔴" in eval_viento:
        estado_global = "🔴 *CONDICIONES DESFAVORABLES / PRECAUCIÓN EXTREMA*"
    elif "🟡" in eval_ola or "🟡" in eval_periodo or "🟡" in eval_corriente or "🟡" in eval_viento:
        estado_global = "🟡 *CONDICIONES ACEPTABLES CON PRECAUCIÓN*"
    else:
        estado_global = "🟢 *CONDICIONES ÓPTIMAS*"

    # 6. CONSTRUCCIÓN DEL REPORTE FINAL (Ajustado para encajar en main.py)
    reporte = (
        f"{estado_global}\n\n"
        f"🔹 *Desglose técnico:*\n"
        f"• {eval_ola}\n"
        f"• {eval_periodo}\n"
        f"• {eval_viento}\n"
        f"• {eval_corriente}"
    )

    return reporte
