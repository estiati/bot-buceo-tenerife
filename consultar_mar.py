import requests

def obtener_datos_marinos(latitud, longitud):
    """
    Consulta las API de Open-Meteo (Marine y Weather) para obtener
    oleaje, período, corrientes y viento en tiempo real.
    """
    try:
        # 1. DATOS MARINOS (Olas y Corrientes)
        url_marine = f"https://marine-api.open-meteo.com/v1/marine?latitude={latitud}&longitude={longitud}&hourly=wave_height,wave_period,wave_direction,ocean_current_velocity,ocean_current_direction&timezone=auto"
        res_marine = requests.get(url_marine, timeout=10).json()
        
        # Extraemos el dato de la hora actual (índice 0)
        hourly_m = res_marine.get("hourly", {})
        altura_ola = hourly_m.get("wave_height", [0])[0]
        periodo_ola = hourly_m.get("wave_period", [0])[0]
        dir_ola = hourly_m.get("wave_direction", [0])[0]
        vel_corriente = hourly_m.get("ocean_current_velocity", [0])[0]
        dir_corriente = hourly_m.get("ocean_current_direction", [0])[0]

        # Convertir corriente de m/s a nudos si la API devuelve m/s (1 m/s ≈ 1.94384 kn)
        # Nota: Open-Meteo suele dar m/s en corrientes, convertimos para estandarizar:
        vel_corriente_kn = round(vel_corriente * 1.94384, 2)

        # 2. DATOS METEOROLÓGICOS (Viento)
        url_weather = f"https://api.open-meteo.com/v1/forecast?latitude={latitud}&longitude={longitud}&hourly=wind_speed_10m,wind_direction_10m&timezone=auto"
        res_weather = requests.get(url_weather, timeout=10).json()
        
        hourly_w = res_weather.get("hourly", {})
        vel_viento_kmh = hourly_w.get("wind_speed_10m", [0])[0]
        dir_viento = hourly_w.get("wind_direction_10m", [0])[0]

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
        print(f"Error al consultar la API: {e}")
        return None
