def evaluar_condiciones(altura_ola, periodo, velocidad_corriente, dir_corriente=None, viento_speed=None):
    """
    Evalúa las condiciones del mar específicas para buceo recreativo/técnico.
    """
    alertas = []
    
    # 1. EVALUACIÓN DE LA OLA (ALTURA)
    if altura_ola < 0.7:
        eval_ola = "🟢 Mar llana / Rizada. Entrada muy fácil."
    elif 0.7 <= altura_ola <= 1.2:
        eval_ola = "🟡 Marejadilla. Precaución en la orilla/rampa."
    else:
        eval_ola = "🔴 Marejada / Marejana. Entrada complicada o peligrosa."
        alertas.append("Oleaje elevado")

    # 2. EVALUACIÓN DEL PERÍODO (LÓGICA CORREGIDA PARA BUCEO)
    # Períodos cortos (< 7s) = Mar de viento / ola picada / incómoda en superficie
    # Períodos medios (7s - 10s) = Condición normal
    # Períodos largos (> 10s) = Mar de fondo suave y espaciada
    if periodo < 6.0:
        eval_periodo = f"🟡 Período corto ({periodo:.1f}s): Mar picada de viento. Superficie molesta."
    elif 6.0 <= periodo <= 9.0:
        eval_periodo = f"🟢 Período medio ({periodo:.1f}s): Condiciones aceptables."
    else:
        eval_periodo = f"🟢 Período largo ({periodo:.1f}s): Mar de fondo limpia y espaciada."

    # 3. EVALUACIÓN DE LA CORRIENTE
    if velocidad_corriente < 0.4:
        eval_corriente = f"🟢 Corriente floja ({velocidad_corriente:.1f} kn). Fácil navegación."
    elif 0.4 <= velocidad_corriente <= 0.8:
        eval_corriente = f"🟡 Corriente moderada ({velocidad_corriente:.1f} kn). Planificar inmersión contra corriente a la ida."
    else:
        eval_corriente = f"🔴 Corriente fuerte ({velocidad_corriente:.1f} kn). Solo para buceadores experimentados."
        alertas.append("Corriente fuerte")

    # 4. DETERMINACIÓN DEL ESTADO GLOBAL
    if "🔴" in eval_ola or "🔴" in eval_corriente:
        estado_global = "🔴 CONDICIONES DESFAVORABLES / PRECAUCIÓN EXTREMA"
    elif "🟡" in eval_ola or "🟡" in eval_periodo or "🟡" in eval_corriente:
        estado_global = "🟡 CONDICIONES ACCEPTABLES CON PRECAUCIÓN"
    else:
        estado_global = "🟢 CONDICIONES OPTIMAS"

    # CONSTRUCCIÓN DEL REPORTE
    reporte = (
        f"--- EVALUACIÓN DE BUCEO ---\n"
        f"Estado global: {estado_global}\n\n"
        f"• Oleaje: {eval_ola}\n"
        f"• Período: {eval_periodo}\n"
        f"• Corriente: {eval_corriente}\n"
    )

    return reporte
