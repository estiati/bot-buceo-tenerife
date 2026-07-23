def evaluar_inmersion(datos):
    if not datos:
        return "No hay datos disponibles para realizar el análisis."

    olas = datos.get("wave_height", 0)
    periodo = datos.get("wave_period", 0)
    v_corriente = datos.get("ocean_current_velocity", 0)
    d_corriente = datos.get("ocean_current_direction", 0)

    # 1. Evaluación de Oleaje
    if olas < 0.8:
        estado_mar = "🟢 Mar en calma / Óptimo"
    elif olas < 1.5:
        estado_mar = "🟡 Marejadilla / Precaución en la entrada y salida"
    else:
        estado_mar = "🔴 Oleaje fuerte / No recomendable entrar"

    # 2. Evaluación del Periodo (Mar de fondo)
    if periodo >= 9.0:
        aviso_periodo = "⚠️ Mar de fondo apreciable. Ojo con el resaca y mar de leva en cotas someras."
    else:
        aviso_periodo = "✅ Periodo corto/medio. Entrada y fondo relativamente estables."

    # 3. Evaluación de Corriente
    # Convertimos m/s a nudos para referencia náutica (1 m/s ≈ 1.94 nudos)
    nudos = v_corriente * 1.94
    if nudos < 0.5:
        nivel_corriente = f"🟢 Corriente floja ({nudos:.1f} kn, dir {d_corriente}°)"
    elif nudos < 1.2:
        nivel_corriente = f"🟡 Corriente moderada ({nudos:.1f} kn, dir {d_corriente}°). Planificar inmersión contra corriente a la ida."
    else:
        nivel_corriente = f"🔴 Corriente fuerte ({nudos:.1f} kn, dir {d_corriente}°). Riesgo de deriva importante."

    # Resumen
    reporte = (
        f"--- EVALUACIÓN DE BUCEO ---\n"
        f"Estado del mar: {estado_mar}\n"
        f"Periodo: {periodo}s -> {aviso_periodo}\n"
        f"Corriente: {nivel_corriente}\n"
    )
    return reporte
