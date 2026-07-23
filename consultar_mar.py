import json
import urllib.request
from evaluador import evaluar_inmersion

def obtener_datos_marinos(latitud, longitud):
    url = (
        f"https://marine-api.open-meteo.com/v1/marine?"
        f"latitude={latitud}&longitude={longitud}&"
        f"current=wave_height,wave_direction,wave_period,"
        f"ocean_current_velocity,ocean_current_direction&"
        f"timezone=auto"
    )

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data.get("current", {})
    except Exception as e:
        print(f"Error al conectar con la API: {e}")
        return None

if __name__ == "__main__":
    try:
        with open("zonas_tenerife.json", "r", encoding="utf-8") as f:
            zonas = json.load(f)["zonas"]

        # Probamos con Radazul
        spot_clave = "radazul"
        spot = zonas[spot_clave]

        print(f"=== INFORME PARA: {spot['nombre']} ===")
        datos = obtener_datos_marinos(spot["latitud"], spot["longitud"])

        if datos:
            # Generar evaluación cualitativa
            diagnostico = evaluar_inmersion(datos)
            print(diagnostico)
        else:
            print("No se pudieron obtener datos.")

    except FileNotFoundError:
        print("Error: No se encuentra 'zonas_tenerife.json'.")
