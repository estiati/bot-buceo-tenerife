const diveSpots = [
    { name: "Bajamar", lat: 28.5552, lon: -16.3456, vertiente: "Norte" },
    { name: "Benijo", lat: 28.5762, lon: -16.1859, vertiente: "Norte" },
    { name: "Buenavista del Norte", lat: 28.3733, lon: -16.8504, vertiente: "Norte" },
    { name: "El Bollullo", lat: 28.4192, lon: -16.5208, vertiente: "Norte" },
    { name: "El Pris", lat: 28.5085, lon: -16.4184, vertiente: "Norte" },
    { name: "El Sauzal (Rojas)", lat: 28.4878, lon: -16.4442, vertiente: "Norte" },
    { name: "El Socorro", lat: 28.3957, lon: -16.6025, vertiente: "Norte" },
    { name: "Garachico", lat: 28.3734, lon: -16.7653, vertiente: "Norte" },
    { name: "Icod de los Vinos", lat: 28.3789, lon: -16.7202, vertiente: "Norte" },
    { name: "Los Silos", lat: 28.3811, lon: -16.8164, vertiente: "Norte" },
    { name: "Mesa del Mar", lat: 28.5025, lon: -16.4231, vertiente: "Norte" },
    { name: "Puerto de la Cruz", lat: 28.4165, lon: -16.5469, vertiente: "Norte" },
    { name: "Punta del Hidalgo", lat: 28.5714, lon: -16.3292, vertiente: "Norte" },
    { name: "San Juan de la Rambla", lat: 28.3925, lon: -16.6475, vertiente: "Norte" },
    { name: "Santa Ursula", lat: 28.4239, lon: -16.4914, vertiente: "Norte" },
    { name: "Taganana", lat: 28.5721, lon: -16.2001, vertiente: "Norte" },
    { name: "Valle de Guerra", lat: 28.5303, lon: -16.3989, vertiente: "Norte" },
    { name: "Abades", lat: 28.1419, lon: -16.4428, vertiente: "Sur" },
    { name: "Alcala", lat: 28.2045, lon: -16.8272, vertiente: "Sur" },
    { name: "Boca Cangrejo", lat: 28.4128, lon: -16.3159, vertiente: "Sur" },
    { name: "Callao Salvaje", lat: 28.1258, lon: -16.7772, vertiente: "Sur" },
    { name: "Candelaria", lat: 28.3551, lon: -16.3703, vertiente: "Sur" },
    { name: "Costa Adeje", lat: 28.0833, lon: -16.7333, vertiente: "Sur" },
    { name: "El Medano", lat: 28.0458, lon: -16.5367, vertiente: "Sur" },
    { name: "El Poris", lat: 28.1611, lon: -16.4325, vertiente: "Sur" },
    { name: "Fonsalia", lat: 28.1883, lon: -16.8219, vertiente: "Sur" },
    { name: "Igueste de San Andres", lat: 28.5367, lon: -16.1558, vertiente: "Sur" },
    { name: "La Caleta", lat: 28.1022, lon: -16.7531, vertiente: "Sur" },
    { name: "La Jaca", lat: 28.1256, lon: -16.4603, vertiente: "Sur" },
    { name: "Las Americas", lat: 28.0583, lon: -16.7297, vertiente: "Sur" },
    { name: "Las Eras", lat: 28.1824, lon: -16.4172, vertiente: "Sur" },
    { name: "Las Galletas", lat: 28.0101, lon: -16.6579, vertiente: "Sur" },
    { name: "Las Teresitas", lat: 28.5089, lon: -16.1856, vertiente: "Sur" },
    { name: "Los Abrigos", lat: 28.0319, lon: -16.6042, vertiente: "Sur" },
    { name: "Los Cristianos", lat: 28.0526, lon: -16.7176, vertiente: "Sur" },
    { name: "Los Gigantes", lat: 28.2436, lon: -16.8406, vertiente: "Sur" },
    { name: "Palm-Mar", lat: 28.0194, lon: -16.6975, vertiente: "Sur" },
    { name: "Playa Paraiso", lat: 28.1189, lon: -16.7725, vertiente: "Sur" },
    { name: "Playa San Juan", lat: 28.1764, lon: -16.8122, vertiente: "Sur" },
    { name: "Puertito de Guimar", lat: 28.3006, lon: -16.3789, vertiente: "Sur" },
    { name: "Puerto de Santiago", lat: 28.2344, lon: -16.8389, vertiente: "Sur" },
    { name: "Punta Prieta", lat: 28.2719, lon: -16.3934, vertiente: "Sur" },
    { name: "Radazul", lat: 28.4065, lon: -16.3223, vertiente: "Sur" },
    { name: "San Miguel de Abona", lat: 28.0264, lon: -16.6178, vertiente: "Sur" },
    { name: "Tabaiba", lat: 28.4025, lon: -16.3263, vertiente: "Sur" },
    { name: "Tajao", lat: 28.1092, lon: -16.4719, vertiente: "Sur" }
];

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("dive-spot");
    
    // Poblar el selector de forma alfabética
    diveSpots.sort((a, b) => a.name.localeCompare(b.name));
    
    diveSpots.forEach((spot, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = spot.name;
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        const index = e.target.value;
        if (index !== "") {
            fetchData(diveSpots[index]);
        }
    });
});

async function fetchData(spot) {
    const resultsSection = document.getElementById("results-section");
    const loading = document.getElementById("loading");
    
    resultsSection.classList.add("hidden");
    loading.classList.remove("hidden");
    
    document.getElementById("selected-spot-name").textContent = spot.name;

    try {
        const timezone = "Europe/Madrid";
        
        // Fetch Weather API (añadimos uv_index, cloud_cover, y temperatura del agua simulada con soil_temperature_0cm en el mar)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,cloud_cover,uv_index&hourly=soil_temperature_0cm,cloud_cover,uv_index&daily=temperature_2m_max,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max&timezone=${timezone}&cell_selection=sea`;
        
        // Fetch Marine API (añadimos corrientes y nivel del mar para calcular mareas)
        const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.lat}&longitude=${spot.lon}&hourly=wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction,sea_level_height_msl&timezone=${timezone}`;

        const [weatherRes, marineRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(marineUrl)
        ]);

        if (!weatherRes.ok || !marineRes.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        const weatherData = await weatherRes.json();
        const marineData = await marineRes.json();

        updateUI(weatherData, marineData, spot);
    } catch (error) {
        console.error("Error obteniendo los datos:", error);
        alert("Hubo un error al obtener los datos. Por favor, inténtalo de nuevo.");
    } finally {
        loading.classList.add("hidden");
        resultsSection.classList.remove("hidden");
        
        // Forzar a Leaflet a recalcular su tamaño una vez que el contenedor es visible
        if (map) {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    }
}

function updateUI(weatherData, marineData, spot) {
    // ---- HOY (Actual) ----
    const currentW = weatherData.current;
    
    // Encontrar la hora actual para el oleaje
    const now = new Date();
    // Open-meteo hourly time format is ISO 8601 e.g. "2023-10-25T14:00"
    // Buscamos el índice de la hora más cercana
    const currentHourString = now.toISOString().slice(0, 14) + "00"; 
    let currentHourIndex = marineData.hourly.time.findIndex(t => t.startsWith(now.toISOString().slice(0,13)));
    
    if (currentHourIndex === -1) currentHourIndex = 0; // fallback

    const tTemp = currentW.temperature_2m;
    const tWater = weatherData.hourly.soil_temperature_0cm[currentHourIndex];
    const tWind = currentW.wind_speed_10m;
    const tWaveH = marineData.hourly.wave_height[currentHourIndex];
    const tCurrent = marineData.hourly.ocean_current_velocity[currentHourIndex];

    document.getElementById("today-temp").innerHTML = `${tTemp} °C`;
    document.getElementById("today-water-temp").innerHTML = `${tWater || '--'} °C`;
    document.getElementById("today-wind-speed").innerHTML = `${tWind} km/h ${getAlertIcon(getAlertLevel('wind', tWind))}`;
    document.getElementById("today-wind-dir").textContent = `Dir: ${getWindDirection(currentW.wind_direction_10m)}`;
    
    document.getElementById("today-wave-height").innerHTML = `${tWaveH || '--'} m ${getAlertIcon(getAlertLevel('wave', tWaveH))}`;
    document.getElementById("today-wave-dir").textContent = `Dir: ${getWindDirection(marineData.hourly.wave_direction[currentHourIndex])}`;
    document.getElementById("today-wave-period").innerHTML = `Periodo: ${marineData.hourly.wave_period[currentHourIndex] || '--'} s ${getAlertIcon(getAlertLevel('period', marineData.hourly.wave_period[currentHourIndex]))}`;
    
    document.getElementById("today-current-speed").innerHTML = `${tCurrent || '--'} km/h ${getAlertIcon(getAlertLevel('current', tCurrent))}`;
    document.getElementById("today-current-dir").textContent = `Dir: ${getWindDirection(marineData.hourly.ocean_current_direction[currentHourIndex])}`;
    
    document.getElementById("today-uv").textContent = `UV: ${currentW.uv_index || '--'}`;
    document.getElementById("today-clouds").textContent = `Nubes: ${currentW.cloud_cover || '0'}%`;

    // Mareas Hoy
    const todayStr = now.toISOString().slice(0, 10);
    let todayStartIdx = marineData.hourly.time.findIndex(t => t.startsWith(todayStr));
    if (todayStartIdx === -1) todayStartIdx = 0;
    const todayTides = calculateTides(marineData.hourly.time, marineData.hourly.sea_level_height_msl, todayStartIdx, todayStartIdx + 24);
    
    document.getElementById("today-tide-high").textContent = `Pleamar: ~${todayTides.high}`;
    document.getElementById("today-tide-low").textContent = `Bajamar: ~${todayTides.low}`;
    document.getElementById("today-tide-coef").textContent = `Coeficiente: ${todayTides.coef}`;

    // ---- MAÑANA (Previsión) ----
    const tomorrowIndex = 1; // 0 es hoy, 1 es mañana en el array daily
    const tomorrowW = weatherData.daily;

    // Buscamos la hora de mediodía de mañana para el oleaje (12:00)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowMiddayStr = tomorrow.toISOString().slice(0, 11) + "12:00";
    let tomorrowHourIndex = marineData.hourly.time.findIndex(t => t === tomorrowMiddayStr);
    
    // Si no encuentra exactamente las 12, pillamos unas 24 horas después
    if (tomorrowHourIndex === -1) tomorrowHourIndex = currentHourIndex + 24;
    
    if (tomorrowHourIndex >= marineData.hourly.wave_height.length) {
        tomorrowHourIndex = marineData.hourly.wave_height.length - 1;
    }

    const tomTemp = tomorrowW.temperature_2m_max[tomorrowIndex];
    const tomWater = weatherData.hourly.soil_temperature_0cm[tomorrowHourIndex];
    const tomWind = tomorrowW.wind_speed_10m_max[tomorrowIndex];
    const tomWaveH = marineData.hourly.wave_height[tomorrowHourIndex];
    const tomCurrent = marineData.hourly.ocean_current_velocity[tomorrowHourIndex];

    document.getElementById("tomorrow-temp").innerHTML = `${tomTemp} °C`;
    document.getElementById("tomorrow-water-temp").innerHTML = `${tomWater || '--'} °C`;
    document.getElementById("tomorrow-wind-speed").innerHTML = `${tomWind} km/h ${getAlertIcon(getAlertLevel('wind', tomWind))}`;
    document.getElementById("tomorrow-wind-dir").textContent = `Dir: ${getWindDirection(tomorrowW.wind_direction_10m_dominant[tomorrowIndex])}`;
    
    document.getElementById("tomorrow-wave-height").innerHTML = `${tomWaveH || '--'} m ${getAlertIcon(getAlertLevel('wave', tomWaveH))}`;
    document.getElementById("tomorrow-wave-dir").textContent = `Dir: ${getWindDirection(marineData.hourly.wave_direction[tomorrowHourIndex])}`;
    document.getElementById("tomorrow-wave-period").innerHTML = `Periodo: ${marineData.hourly.wave_period[tomorrowHourIndex] || '--'} s ${getAlertIcon(getAlertLevel('period', marineData.hourly.wave_period[tomorrowHourIndex]))}`;

    document.getElementById("tomorrow-current-speed").innerHTML = `${tomCurrent || '--'} km/h ${getAlertIcon(getAlertLevel('current', tomCurrent))}`;
    document.getElementById("tomorrow-current-dir").textContent = `Dir: ${getWindDirection(marineData.hourly.ocean_current_direction[tomorrowHourIndex])}`;
    
    document.getElementById("tomorrow-uv").textContent = `UV: ${tomorrowW.uv_index_max[tomorrowIndex] || '--'}`;
    document.getElementById("tomorrow-clouds").textContent = `Nubes: ${weatherData.hourly.cloud_cover[tomorrowHourIndex] || '0'}%`;

    // Mareas Mañana
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    let tomorrowStartIdx = marineData.hourly.time.findIndex(t => t.startsWith(tomorrowStr));
    if (tomorrowStartIdx === -1) tomorrowStartIdx = todayStartIdx + 24;
    const tomorrowTides = calculateTides(marineData.hourly.time, marineData.hourly.sea_level_height_msl, tomorrowStartIdx, tomorrowStartIdx + 24);
    
    document.getElementById("tomorrow-tide-high").textContent = `Pleamar: ~${tomorrowTides.high}`;
    document.getElementById("tomorrow-tide-low").textContent = `Bajamar: ~${tomorrowTides.low}`;
    document.getElementById("tomorrow-tide-coef").textContent = `Coeficiente: ${tomorrowTides.coef}`;

    // Actualizar Visuales (Mapa y Gráfica)
    updateMap(spot, currentW, marineData, currentHourIndex);
    updateChart(marineData, todayStartIdx);
    
    // Generar recomendaciones
    const adviceList = document.getElementById("dive-advice-list");
    const advices = generateAdvice(tWind, tWaveH, tCurrent, currentW.wind_direction_10m, marineData.hourly.ocean_current_direction[currentHourIndex], spot, marineData.hourly.wave_period[currentHourIndex]);
    adviceList.innerHTML = advices.map(a => `<li>${a}</li>`).join("");
}

// Cálculo aproximado de mareas basado en nivel del mar
function calculateTides(times, heights, startIdx, endIdx) {
    if (!heights || startIdx >= heights.length) return { high: '--', low: '--', coef: '--' };
    
    let max = -Infinity, min = Infinity;
    let maxHour = '', minHour = '';
    
    const limit = Math.min(endIdx, heights.length);
    for (let i = startIdx; i < limit; i++) {
        if (heights[i] > max) {
            max = heights[i];
            maxHour = times[i].slice(11, 16);
        }
        if (heights[i] < min) {
            min = heights[i];
            minHour = times[i].slice(11, 16);
        }
    }

    // Coeficiente aproximado (rango normal en Canarias ~2.6m para mareas vivas de 120)
    const range = max - min; 
    let coef = Math.round((range / 2.6) * 120);
    if (coef < 20) coef = 20;
    if (coef > 120) coef = 120;
    
    return {
        high: maxHour || '--',
        low: minHour || '--',
        coef: isNaN(coef) ? '--' : coef
    };
}

// Convertir grados a puntos cardinales
function getWindDirection(degree) {
    if (degree === undefined || degree === null) return '--';
    const val = Math.floor((degree / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

// Evaluar alertas (rojo/ámbar)
function getAlertLevel(type, value) {
    if (value === undefined || value === null || isNaN(value)) return null;
    const val = parseFloat(value);
    
    switch (type) {
        case 'wave': // Oleaje en metros
            if (val > 1.2) return 'red'; // Peligroso
            if (val >= 0.7) return 'amber'; // Precaución
            break;
        case 'period': // Período de ola en segundos
            if (val > 0 && val < 6.0) return 'amber'; // Mar picada
            break;
        case 'wind': // Viento en km/h
            if (val > 25) return 'red'; // Peligroso
            if (val >= 15) return 'amber'; // Precaución
            break;
        case 'current': // Corriente en km/h
            if (val > 1.5) return 'red'; // Peligroso (aprox > 0.8 nudos)
            if (val >= 0.75) return 'amber'; // Precaución (aprox >= 0.4 nudos)
            break;
    }
    return null;
}

function getAlertIcon(level) {
    if (level === 'red') {
        return '<span title="Condiciones Peligrosas" style="color: #ff3333; margin-left: 6px; font-size: 1.2rem; filter: drop-shadow(0 0 5px rgba(255,51,51,0.5));">⚠️</span>';
    }
    if (level === 'amber') {
        return '<span title="Precaución Recomendada" style="color: #ffaa00; margin-left: 6px; font-size: 1.2rem; filter: drop-shadow(0 0 5px rgba(255,170,0,0.5));">⚠️</span>';
    }
    return '';
}

// Generar recomendaciones de buceo
function generateAdvice(wind, wave, current, windDirDegree, currentDirDegree, spot, wavePeriod) {
    const advice = [];
    const w = parseFloat(wind) || 0;
    const wv = parseFloat(wave) || 0;
    const c = parseFloat(current) || 0;
    const p = parseFloat(wavePeriod) || 0;
    
    // Oleaje
    if (wv > 1.2) {
        advice.push("<strong>Oleaje elevado:</strong> Entrada complicada o peligrosa. No se aconsejan salidas desde embarcación ni de infantería salvo en calas muy protegidas.");
    } else if (wv >= 0.7) {
        advice.push("<strong>Marejadilla:</strong> Precaución extra en las entradas y salidas desde rocas. Busque puntos de inmersión a resguardo.");
    } else {
        advice.push("<strong>Mar llana / Rizada:</strong> Entrada muy fácil, ideal tanto para salidas en barco como desde costa.");
    }

    // Período de ola
    if (p > 0 && p < 6.0) {
        advice.push("<strong>Período corto:</strong> Mar picada de viento. Superficie molesta y revuelta.");
    }

    // Viento
    if (w > 25) {
        advice.push("<strong>Vientos fuertes:</strong> Riesgo elevado en la navegación. Deriva y oleaje local agitado. Se desaconsejan las salidas en embarcación.");
    } else if (w >= 15) {
        advice.push("<strong>Viento moderado:</strong> Puede incomodar en superficie, generar corriente superficial y dificultar el ascenso a la embarcación.");
    } else {
        advice.push("<strong>Viento flojo:</strong> Condiciones inmejorables en superficie, facilitando la preparación y el ascenso.");
    }

    // Corriente de Fondo y Dirección respecto a la costa
    let currentAdv = "";
    if (c > 1.5) {
        currentAdv = "<strong>Corriente de fondo extrema:</strong> Solo apto para buceadores técnicos o muy experimentados. Uso de boya deco (SMB) obligatorio.";
    } else if (c >= 0.75) {
        currentAdv = "<strong>Corriente moderada:</strong> ";
    } else {
        currentAdv = "<strong>Corriente floja:</strong> Fácil navegación. Condiciones perfectas para fotografía submarina y principiantes.";
    }

    let directionAdv = "";
    // Si hay corriente apreciable, evaluar la dirección respecto a la orientación de la costa
    if (c >= 1.0 && currentDirDegree !== undefined && spot) {
        
        let outwardDir = undefined;
        if (spot.vertiente === "Norte") {
            outwardDir = 360; // Hacia mar abierto en la cara norte
        } else if (spot.vertiente === "Sur") {
            outwardDir = 180; // Hacia mar abierto en la cara sur
        }
        
        if (outwardDir !== undefined) {
            // currentDirDegree es hacia donde va la corriente
            const diff = Math.abs((currentDirDegree - outwardDir + 360) % 360);
            
            if (diff <= 45 || diff >= 315) {
                directionAdv = "⚠️ La corriente empuja hacia <strong>mar adentro</strong>. Costará volver a la costa, guarde energía para el regreso o inicie la inmersión en contra de la corriente.";
            } else if (diff >= 135 && diff <= 225) {
                directionAdv = "✅ La corriente empuja hacia la <strong>costa</strong>. Le costará alejarse al inicio, pero le beneficiará al regresar (regreso a favor de corriente).";
            } else {
                directionAdv = "➡️ La corriente corre <strong>paralela a la costa (deriva lateral)</strong>. Si bucea desde tierra, tenga en cuenta que el punto por el que salga del agua podría estar desplazado lateralmente respecto a su punto de entrada. Si dispone de barco, es ideal para dejarse llevar (buceo caribeño).";
            }
        } else {
            // Fallback si no hay mapeo específico
            directionAdv = "Evalúe in situ la dirección de la corriente. Ideal para organizar un buceo a la deriva si se dispone de barco.";
        }
    }
    
    if (directionAdv !== "") {
        advice.push(`<div class="split-advice"><div class="advice-left">${currentAdv}</div><div class="advice-separator"></div><div class="advice-right">${directionAdv}</div></div>`);
    } else {
        advice.push(currentAdv);
    }
    
    // Visión General
    if (w < 25 && wv < 1.2 && c < 1.5) {
        advice.push("<strong>Visión General:</strong> Día apto para el buceo. Disfrute de la inmersión respetando siempre sus límites de titulación.");
    }
    
    return advice;
}

// ---- MÓDULOS VISUALES ----

let map = null;
let tideChart = null;

function updateMap(spot, currentW, marineData, currentHourIndex) {
    if (!map) {
        map = L.map('map', { zoomControl: false }).setView([spot.lat, spot.lon], 13);
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
    } else {
        map.setView([spot.lat, spot.lon], 13);
        // Eliminar marcadores anteriores
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }

    const windDir = currentW.wind_direction_10m || 0;
    const waveDir = marineData.hourly.wave_direction[currentHourIndex] || 0;
    const currentDir = marineData.hourly.ocean_current_direction[currentHourIndex] || 0;

    // Helper para crear SVG divIcon con flechas (Sumamos 180 para que la flecha apunte hacia donde va el flujo)
    const createArrowIcon = (color, rotation) => {
        const svg = `
            <svg class="vector-svg" viewBox="0 0 24 24" style="transform: rotate(${rotation + 180}deg);">
                <path d="M12 2v20M12 2l-6 6M12 2l6 6" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
        `;
        return L.divIcon({
            className: 'vector-icon',
            html: svg,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    };

    // Desfase para que no se superpongan exactamente
    const latOffset = 0.003;
    const lonOffset = 0.003;

    // Viento (Cyan)
    L.marker([spot.lat, spot.lon - lonOffset], {icon: createArrowIcon('#00e5ff', windDir)}).addTo(map).bindPopup('Dirección del Viento');
    // Oleaje (Blanco)
    L.marker([spot.lat - latOffset, spot.lon], {icon: createArrowIcon('#ffffff', waveDir)}).addTo(map).bindPopup('Dirección del Oleaje');
    // Corriente (Verde)
    L.marker([spot.lat, spot.lon + lonOffset], {icon: createArrowIcon('#00ffaa', currentDir)}).addTo(map).bindPopup('Dirección de la Corriente');
}

function updateChart(marineData, todayStartIdx) {
    const ctx = document.getElementById('tideChart').getContext('2d');
    
    // Obtenemos 48 horas de datos (hoy y mañana)
    const limit = Math.min(todayStartIdx + 48, marineData.hourly.time.length);
    const times = marineData.hourly.time.slice(todayStartIdx, limit).map(t => {
        const date = new Date(t);
        return `${date.getHours().toString().padStart(2, '0')}:00`;
    });
    const heights = marineData.hourly.sea_level_height_msl.slice(todayStartIdx, limit);

    if (tideChart) {
        tideChart.destroy();
    }

    // Crear gradiente para el área bajo la curva
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');

    tideChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Nivel del Mar (m)',
                data: heights,
                borderColor: '#00e5ff',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4, // Curvas suaves
                pointRadius: 0,
                pointHitRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} m`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#a0aec0', maxTicksLimit: 12 },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    ticks: { color: '#a0aec0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}
