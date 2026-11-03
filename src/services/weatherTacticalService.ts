export interface TacticalWeatherState {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    conditionText: string;
  };
  alerts: {
    severoOficial: boolean;
    olaCalor: boolean;
    olaPolar: boolean;
    eventoCrisis48h: string | null;
  };
  tacticoHoy: string;
  incendio3030: {
    puntos: number;
    color: string;
    label: string;
  };
  narrativa7Dias: string;
  riesgosEstacionales: {
    mesMaxCalor: string;
    mesMaxLluvia: string;
    mesMaxPolar: string;
  };
  historicoAnual: {
    meses: string[];
    tMaxMedias: number[];
    tMinMedias: number[];
    lluviaTotal: number[];
  };
  emergencia: {
    telefono: string;
    entidad: string;
    hospitalesUrl: string;
    meteoOficialUrl: string;
  };
}

export function traducirWeatherCode(code: number): string {
  const map: Record<number, string> = {
    0: 'Despejado',
    1: 'Mayormente Despejado',
    2: 'Parcialmente Nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna Ligera',
    53: 'Llovizna Moderada',
    55: 'Llovizna Densa',
    61: 'Lluvia Ligera',
    63: 'Lluvia Moderada',
    65: 'Lluvia Fuerte',
    71: 'Nieve Ligera',
    73: 'Nieve Moderada',
    75: 'Nieve Fuerte',
    80: 'Chaparrones Aislados',
    81: 'Chaparrones Moderados',
    82: 'Chaparrones Violentos',
    95: 'Tormenta Eléctrica',
    96: 'Tormenta con Granizo',
    99: 'Tormenta Severa con Granizo'
  };
  return map[code] || 'Variable';
}

export function obtenerLinkMeteo(pais: string): string {
  const norm = pais.toLowerCase();
  if (norm.includes('argentina')) return 'https://www.smn.gob.ar/';
  if (norm.includes('chile')) return 'https://www.meteochile.gob.cl/';
  if (norm.includes('espana') || norm.includes('españa')) return 'https://www.aemet.es/';
  if (norm.includes('united states') || norm.includes('estados unidos')) return 'https://www.weather.gov/';
  if (norm.includes('mexico') || norm.includes('méxico')) return 'https://smn.conagua.gob.mx/';
  if (norm.includes('brasil') || norm.includes('brazil')) return 'https://portal.inmet.gov.br/';
  if (norm.includes('uruguay')) return 'https://www.inumet.gub.uy/';
  if (norm.includes('colombia')) return 'http://www.ideam.gov.co/';
  return `https://www.google.com/search?q=servicio+meteorologico+oficial+${encodeURIComponent(pais)}`;
}

export async function fetchTacticalWeatherData(
  lat: number,
  lon: number,
  country: string
): Promise<TacticalWeatherState | null> {
  try {
    // 1. Current forecast & daily
    const cRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`
    );
    if (!cRes.ok) return null;
    const cData = await cRes.json();

    const cur = cData.current;
    const t = Math.round(cur.temperature_2m);
    const h = cur.relative_humidity_2m;
    const v = Math.round(cur.wind_speed_10m);

    // 2. Archive 48hs
    const hoy = new Date();
    const hace2d = new Date(hoy.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const ayer = new Date(hoy.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let acumuladoReal48 = 0;
    let eventoSevero = false;
    let txtEvento: string | null = null;

    try {
      const hRes = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${hace2d}&end_date=${ayer}&daily=precipitation_sum,weather_code&timezone=auto`
      );
      if (hRes.ok) {
        const hData = await hRes.json();
        if (hData.daily && hData.daily.precipitation_sum) {
          acumuladoReal48 = hData.daily.precipitation_sum.reduce((a: number, b: number) => a + (b || 0), 0);
          eventoSevero = hData.daily.weather_code.some((code: number) => code >= 65);
        }
      }
    } catch (e) {
      console.warn('Archive 48h error:', e);
    }

    if (acumuladoReal48 > 70 || eventoSevero) {
      txtEvento = `EVENTO HÍDRICO: ${acumuladoReal48.toFixed(1)}mm de lluvia o tormenta registrados recientemente.`;
    }

    // 3. USGS Earthquakes
    try {
      const sRes = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=400&starttime=${new Date(
          Date.now() - 48 * 3600000
        ).toISOString()}&minmagnitude=4.0`
      );
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.features && sData.features.length > 0) {
          const sismo = sData.features[0].properties;
          txtEvento = txtEvento
            ? `${txtEvento} | SISMO DETECTADO: M${sismo.mag} en la región.`
            : `SISMO DETECTADO: M${sismo.mag} registrado a menos de 400km en las últimas 48hs.`;
        }
      }
    } catch (e) {
      console.warn('USGS earthquake query error:', e);
    }

    // 4. Alerts
    const severoOficial = cur.weather_code >= 65 || v > 50;
    const olaCalor = t >= 35;
    const olaPolar = t <= 5;

    // 5. Tactico Hoy
    const rain24h = cData.hourly?.precipitation?.slice(0, 24)?.some((p: number) => p > 0.5) || false;
    const climaActualLluvia = cur.weather_code >= 51;
    const tacticoHoy = rain24h || climaActualLluvia
      ? 'AVISO: Inestabilidad o lluvias previstas para hoy en el destino.'
      : 'ESTADO: Condiciones estables para las próximas horas.';

    // 6. Indice 30-30-30 de Incendio
    let puntos =
      (t >= 30 ? 33.3 : (t / 30) * 20) +
      (v >= 30 ? 33.3 : (v / 30) * 20) +
      (h <= 30 ? 33.4 : ((100 - h) / 70) * 15);
    puntos = Math.min(Math.round(puntos), 100);

    let colorIncendio = '#27ae60';
    let labelIncendio = 'Riesgo Bajo';
    if (puntos > 75) {
      colorIncendio = '#d32f2f';
      labelIncendio = 'Riesgo Extremo';
    } else if (puntos > 50) {
      colorIncendio = '#e67e22';
      labelIncendio = 'Riesgo Alto';
    } else if (puntos > 25) {
      colorIncendio = '#f1c40f';
      labelIncendio = 'Riesgo Moderado';
    }

    // 7. Planificación 7 Días
    const d = cData.daily;
    const totalLluviaSemana = d.precipitation_sum?.reduce((a: number, b: number) => a + (b || 0), 0) || 0;
    const tMaxSemana = Math.max(...(d.temperature_2m_max || [t]));
    const tMinSemana = Math.min(...(d.temperature_2m_min || [t]));

    let plan = `Evolución próximos 7 días: Acumulado previsto de ${totalLluviaSemana.toFixed(1)}mm. Temperaturas entre ${tMinSemana.toFixed(0)}°C y ${tMaxSemana.toFixed(0)}°C. `;
    if (totalLluviaSemana > 25) plan += `Escenario de inestabilidad activa. Se recomienda precaución en zonas bajas y rutas costeras. `;
    else if (tMaxSemana > 32) plan += `Escenario de calor seco. Riesgo elevado de insolación. `;
    else if (tMinSemana < 8) plan += `Ambiente frío predominante. Se recomienda abrigo adecuado. `;
    else plan += `Condiciones de estabilidad climática típicas de la estación. `;
    if (acumuladoReal48 > 40) plan += `ALERTA: Suelos saturados por precipitaciones previas.`;

    // 8. Historico Anual de Estacionalidad (2024 archive)
    const mesesAbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let mTempMax = Array(12).fill(0);
    let mTempMin = Array(12).fill(0);
    let mLluv = Array(12).fill(0);
    let count = Array(12).fill(0);

    try {
      const histAnualRes = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=2024-01-01&end_date=2024-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );
      if (histAnualRes.ok) {
        const histAnual = await histAnualRes.json();
        const hist = histAnual.daily;
        if (hist && hist.time) {
          hist.time.forEach((f: string, i: number) => {
            const m = new Date(f + 'T00:00:00').getUTCMonth();
            mTempMax[m] += hist.temperature_2m_max[i] || 0;
            mTempMin[m] += hist.temperature_2m_min[i] || 0;
            mLluv[m] += hist.precipitation_sum[i] || 0;
            count[m]++;
          });
        }
      }
    } catch (e) {
      console.warn('Histórico anual error:', e);
    }

    const tMaxMedias = mTempMax.map((val, i) => (count[i] > 0 ? Number((val / count[i]).toFixed(1)) : 22));
    const tMinMedias = mTempMin.map((val, i) => (count[i] > 0 ? Number((val / count[i]).toFixed(1)) : 12));
    const lluviasRedondeadas = mLluv.map(val => Number(val.toFixed(1)));

    const mMaxCalorIdx = tMaxMedias.indexOf(Math.max(...tMaxMedias));
    const mMaxLluviaIdx = lluviasRedondeadas.indexOf(Math.max(...lluviasRedondeadas));
    const mMaxPolarIdx = tMinMedias.indexOf(Math.min(...tMinMedias));

    const isArg = country.toLowerCase().includes('argentina');

    return {
      current: {
        temp: t,
        humidity: h,
        windSpeed: v,
        weatherCode: cur.weather_code,
        conditionText: traducirWeatherCode(cur.weather_code)
      },
      alerts: {
        severoOficial,
        olaCalor,
        olaPolar,
        eventoCrisis48h: txtEvento
      },
      tacticoHoy,
      incendio3030: {
        puntos,
        color: colorIncendio,
        label: labelIncendio
      },
      narrativa7Dias: plan,
      riesgosEstacionales: {
        mesMaxCalor: mesesAbrev[mMaxCalorIdx !== -1 ? mMaxCalorIdx : 0],
        mesMaxLluvia: mesesAbrev[mMaxLluviaIdx !== -1 ? mMaxLluviaIdx : 0],
        mesMaxPolar: mesesAbrev[mMaxPolarIdx !== -1 ? mMaxPolarIdx : 6]
      },
      historicoAnual: {
        meses: mesesAbrev,
        tMaxMedias,
        tMinMedias,
        lluviaTotal: lluviasRedondeadas
      },
      emergencia: {
        telefono: isArg ? '911 / 103' : '911',
        entidad: isArg ? 'Defensa Civil / Bomberos / Policía' : 'Servicios de Emergencia Locales',
        hospitalesUrl: `https://www.google.com/maps/search/hospitales/@${lat},${lon},15z`,
        meteoOficialUrl: obtenerLinkMeteo(country)
      }
    };
  } catch (err) {
    console.error('Tactical weather error:', err);
    return null;
  }
}
