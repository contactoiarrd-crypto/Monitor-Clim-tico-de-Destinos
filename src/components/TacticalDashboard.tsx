import React, { useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarController, 
  LineController 
} from 'chart.js';
import { 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Wind, 
  Thermometer, 
  HeartHandshake, 
  ExternalLink, 
  PhoneCall, 
  ShieldCheck, 
  Layers, 
  Activity,
  CalendarCheck
} from 'lucide-react';
import { TacticalWeatherState } from '../services/weatherTacticalService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
);

interface TacticalDashboardProps {
  weather: TacticalWeatherState | null;
  loading: boolean;
  destinationName: string;
}

export function TacticalDashboard({ weather, loading, destinationName }: TacticalDashboardProps) {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!weather || !chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const { meses, tMaxMedias, lluviaTotal } = weather.historicoAnual;

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          {
            type: 'bar',
            label: 'Lluvia Acumulada (mm)',
            data: lluviaTotal,
            backgroundColor: 'rgba(56, 189, 248, 0.55)',
            borderColor: 'rgb(2, 132, 199)',
            borderWidth: 1.5,
            borderRadius: 6,
            yAxisID: 'yL'
          },
          {
            type: 'line',
            label: 'Temp. Máxima Media (°C)',
            data: tMaxMedias,
            borderColor: '#e11d48',
            backgroundColor: 'rgba(225, 29, 72, 0.1)',
            borderWidth: 2.5,
            pointBackgroundColor: '#e11d48',
            pointRadius: 4,
            tension: 0.35,
            yAxisID: 'yT'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              font: { size: 12, weight: 600 }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          yL: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Precipitación (mm)',
              color: '#0284c7',
              font: { size: 11, weight: 'bold' }
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.8)'
            }
          },
          yT: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Temperatura (°C)',
              color: '#e11d48',
              font: { size: 11, weight: 'bold' }
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [weather]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-slate-500">
        <Activity className="w-8 h-8 text-sky-600 animate-spin mb-3" />
        <p className="text-sm font-semibold">Cargando monitor táctico en tiempo real e histórico para {destinationName}...</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="space-y-6">
      {/* Live Warning Banners */}
      <div className="space-y-2.5">
        {weather.alerts.severoOficial && (
          <div className="p-4 rounded-2xl bg-red-100 border-l-8 border-red-600 text-red-950 font-bold text-sm shadow-sm flex items-center gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>AVISO OFICIAL: Tiempo severo detectado (lluvias fuertes o vientos superiores a 50 km/h). Consultar recomendaciones locales.</span>
          </div>
        )}

        {weather.alerts.eventoCrisis48h && (
          <div className="p-4 rounded-2xl bg-orange-100 border-l-8 border-orange-500 text-orange-950 font-bold text-sm shadow-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
            <span>AVISO DE CRISIS (48hs): {weather.alerts.eventoCrisis48h} Reconfirmar accesibilidad en rutas y caminos.</span>
          </div>
        )}

        {weather.alerts.olaCalor && (
          <div className="p-4 rounded-2xl bg-amber-100 border-l-8 border-amber-500 text-amber-950 font-bold text-sm shadow-sm flex items-center gap-3">
            <Flame className="w-5 h-5 text-amber-600 shrink-0" />
            <span>ALERTA OLA DE CALOR: Temperatura superior a 35°C. Riesgo térmico elevado e hidratación permanente obligatoria.</span>
          </div>
        )}

        {weather.alerts.olaPolar && (
          <div className="p-4 rounded-2xl bg-sky-100 border-l-8 border-sky-600 text-sky-950 font-bold text-sm shadow-sm flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-sky-600 shrink-0" />
            <span>ALERTA OLA POLAR: Temperaturas críticas de frío (menores a 5°C). Ropa de abrigo técnica indispensable.</span>
          </div>
        )}
      </div>

      {/* Grid: Clima Actual & Indice de Incendio 30-30-30 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Live Weather Widget */}
        <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-sky-300 mb-2">
              <span className="uppercase tracking-wider">Tiempo Actual</span>
              <span className="bg-sky-500/20 px-2 py-0.5 rounded text-[10px]">Open-Meteo API</span>
            </div>

            <div className="text-5xl font-black text-white tracking-tight my-1">
              {weather.current.temp}°C
            </div>

            <div className="text-base font-bold uppercase tracking-wide text-sky-200">
              {weather.current.conditionText}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>Hum: <strong>{weather.current.humidity}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-sky-400" />
                <span>Viento: <strong>{weather.current.windSpeed} km/h</strong></span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/10 rounded-xl text-xs text-slate-200 border border-white/10">
            <strong className="text-sky-300 block mb-0.5">PRONÓSTICO HOY:</strong>
            {weather.tacticoHoy}
          </div>
        </div>

        {/* Middle & Right: Fire Risk 30-30-30 & Risk Panel */}
        <div className="md:col-span-2 space-y-5">
          {/* Índice 30-30-30 Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                <h4 className="font-extrabold text-sm text-slate-800">
                  Índice 30-30-30 (Riesgo de Incendio Forestal)
                </h4>
              </div>
              <span 
                className="font-black text-sm px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${weather.incendio3030.color}20`, color: weather.incendio3030.color }}
              >
                {weather.incendio3030.puntos}% — {weather.incendio3030.label}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3">
              <div
                className="h-full transition-all duration-1000 ease-out rounded-full"
                style={{
                  width: `${weather.incendio3030.puntos}%`,
                  backgroundColor: weather.incendio3030.color
                }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              El índice evalúa el cruce de temperatura &gt;30°C, velocidad de viento &gt;30 km/h y humedad &lt;30%.
            </p>
          </div>

          {/* Seasonal Risks Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-red-50 border-l-4 border-red-500 text-xs">
              <div className="font-bold text-red-900">INCENDIOS</div>
              <div className="text-[11px] text-red-700 font-semibold mt-0.5">Pico en {weather.riesgosEstacionales.mesMaxCalor}</div>
              <div className="text-[10px] text-red-800 mt-1 leading-tight">Evitar quemas de residuos y peróxidos.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border-l-4 border-teal-500 text-xs">
              <div className="font-bold text-teal-900">LLUVIAS</div>
              <div className="text-[11px] text-teal-700 font-semibold mt-0.5">Máximo en {weather.riesgosEstacionales.mesMaxLluvia}</div>
              <div className="text-[10px] text-teal-800 mt-1 leading-tight">Revisar drenajes y vados bajos.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50 border-l-4 border-orange-500 text-xs">
              <div className="font-bold text-orange-900">OLA CALOR</div>
              <div className="text-[11px] text-orange-700 font-semibold mt-0.5">Riesgo en {weather.riesgosEstacionales.mesMaxCalor}</div>
              <div className="text-[10px] text-orange-800 mt-1 leading-tight">Priorizar hidratación de niños y adultos.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50 border-l-4 border-sky-500 text-xs">
              <div className="font-bold text-sky-900">OLA POLAR</div>
              <div className="text-[11px] text-sky-700 font-semibold mt-0.5">Pico en {weather.riesgosEstacionales.mesMaxPolar}</div>
              <div className="text-[10px] text-sky-800 mt-1 leading-tight">Ventilar estufas y ropa por capas.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Planning Narrative */}
      <div className="bg-sky-50/70 border-l-4 border-sky-700 p-5 rounded-2xl text-xs sm:text-sm text-sky-950 shadow-xs">
        <div className="flex items-center gap-2 font-extrabold text-sky-900 mb-1">
          <CalendarCheck className="w-4 h-4 text-sky-700" />
          <span>PLANIFICACIÓN TÁCTICA A 7 DÍAS:</span>
        </div>
        <p className="leading-relaxed font-medium">
          {weather.narrativa7Dias}
        </p>
      </div>

      {/* Historical Seasonality Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="text-center mb-4">
          <h4 className="font-extrabold text-base text-slate-800">
            Análisis de Estacionalidad Histórica Anual ({destinationName})
          </h4>
          <p className="text-xs text-slate-400">
            Precipitaciones totales mensuales y temperaturas máximas medias registradas
          </p>
        </div>
        <div className="h-72 w-full">
          <canvas ref={chartCanvasRef} />
        </div>
      </div>

      {/* Emergency Kit & Local Service Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Kit de Emergencia Recomendado */}
        <div className="bg-slate-50 border border-dashed border-sky-700/60 p-5 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-slate-800 text-sm mb-3">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <span>🎒 Kit de Emergencia Recomendado (IIARRD)</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/80">
                <span>💧</span>
                <span>Agua (2L por persona)</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/80">
                <span>🔦</span>
                <span>Linterna y pilas</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/80">
                <span>🩹</span>
                <span>Botiquín completo</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/80">
                <span>📻</span>
                <span>Radio portátil AM/FM</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/80">
                <span>🔋</span>
                <span>Powerbank cargado</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/80">
                <span>📂</span>
                <span>Documentos físicos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Buttons & Hotline */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={weather.emergencia.hospitalesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>🏥</span>
              <span>Hospitales Cercanos</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              href={weather.emergencia.meteoOficialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>🌐</span>
              <span>Meteo Oficial</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              href="https://erccportal.jrc.ec.europa.eu/ECHO-Flash"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>📢</span>
              <span>Eventos ERCC Flash</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              href="https://g.co/floodhub"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>🌊</span>
              <span>Google Flood Hub</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

          {/* Central de Emergencias Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-md">
            <div>
              <div className="text-xs font-bold text-slate-300">Central de Emergencias Locales</div>
              <div className="text-[11px] text-slate-400">{weather.emergencia.entidad}</div>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-sky-400" />
              <div className="text-2xl font-black text-sky-400">{weather.emergencia.telefono}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
