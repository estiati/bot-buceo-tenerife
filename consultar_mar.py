import requests

def obtener_datos_marinos(latitud, longitud):
    """
    Consulta las API de Open-Meteo (Marine y Weather) para obtener
    oleaje, período, corrientes y viento en tiempo real (current).
    """
    try:
        # 1. DATOS MARINOS (Olas y Corrientes) - Usamos 'current' en lugar de 'hourly'
        url_marine = f"https://marine-api.open-meteo.com/v1/marine?latitude={latitud}&longitude={longitud}&current=wave_height,wave_period,wave_direction,ocean_current_velocity,ocean_current_direction&timezone=auto"
        res_marine = requests.get(url_marine, timeout=10).json()
        
        # Extraemos los datos actuales directamente
        current_m = res_marine.get("current", {})
        altura_ola = current_m.get("wave_height", 0.0)
        periodo_ola = current_m.get("wave_period", 0.0)
        dir_ola = current_m.get("wave_direction", 0)
        vel_corriente = current_m.get("ocean_current_velocity", 0.0)
        dir_corriente = current_m.get("ocean_current_direction", 0)

        # Validación de seguridad: Evitar error si la API devuelve None
        if vel_corriente is None:
            vel_corriente = 0.0
            
        # Convertir corriente de m/s a nudos (1 m/s ≈ 1.94384 kn)
        vel_corriente_kn = round(vel_corriente * 1.94384, 2)

        # 2. DATOS METEOROLÓGICOS (Viento) - Usamos 'current'
        url_weather = f"https://api.open-meteo.com/v1/forecast?latitude={latitud}&longitude={longitud}&current=wind_speed_10m,wind_direction_10m&timezone=auto"
        res_weather = requests.get(url_weather, timeout=10).json()
        
        current_w = res_weather.get("current", {})
        vel_viento_kmh = current_w.get("wind_speed_10m", 0.0)
        dir_viento = current_w.get("wind_direction_10m", 0)

        # Devolvemos el diccionario con las claves exactas que espera main.py
        return {
            "altura_ola": altura_ola,
            "periodo": periodo_ola,
            "dir_ola": dir_ola,
            "vel_corriente": vel_corriente_kn,
            "dir_corriente": dir_corriente,
            "vel_viento": vel_viento_kmh,
            "dir_viento": dir_viento
        }

    except Exception as e:
        print(f"Error al consultar la API de Open-Meteo: {e}")
        return None
