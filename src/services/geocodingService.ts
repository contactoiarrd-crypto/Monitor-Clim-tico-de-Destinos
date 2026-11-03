import { CURATED_DESTINATIONS, DestinationInfo } from '../data/destinationsDatabase';
import { NOAA_ZONES, NoaaZone, SeasonKey, NOAA_LEGEND } from '../data/noaaClimateData';

export interface LocationResolutionResult {
  query: string;
  matchedName: string;
  detectedZone: string;
  country: string;
  stateOrProvince?: string;
  coords: [number, number]; // [lat, lng]
  source: 'curated' | 'nominatim_osm';
  season: SeasonKey;
  noaaZone: NoaaZone | null;
  category: string;
  categoryLabel: string;
  colorHex: string;
  bgLightHex: string;
  icon: string;
  prognosisSummary: string;
  detailedImpact: string;
  touristAdvice: string;
  packingAdvice: string;
  isNeutral: boolean;
}

// Point-in-polygon ray casting algorithm
function isPointInPolygon(point: [number, number], vs: [number, number][]): boolean {
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Normalize strings (remove accents, trim, lowercase)
export function normalizeStr(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Intelligent zone inferrer for arbitrary coordinates / address details
export function inferZoneFromAddress(
  coords: [number, number],
  displayName: string,
  country?: string,
  state?: string
): string {
  const [lat, lng] = coords;
  const normCountry = normalizeStr(country || '');
  const normState = normalizeStr(state || '');
  const normName = normalizeStr(displayName || '');

  // Costa Argentina
  if (
    normCountry.includes('argentina') &&
    (normState.includes('buenos aires') || normName.includes('buenos aires')) &&
    lat <= -35.0 && lat >= -41.0 &&
    lng >= -63.5 && lng <= -56.0
  ) {
    if (lng >= -59.5 || normName.includes('costa') || normName.includes('mar') || normName.includes('playa')) {
      return 'Costa Argentina (Costa Atlántica Bonaerense)';
    }
  }

  // Río de la Plata y AMBA
  if (
    normCountry.includes('argentina') &&
    (normName.includes('capital') || normName.includes('buenos aires') || normName.includes('tigre') || normName.includes('la plata')) &&
    lat >= -35.2 && lat <= -34.2 && lng >= -59.0 && lng <= -58.0
  ) {
    return 'Río de la Plata y Área Metropolitana (AMBA)';
  }

  // Litoral Argentino
  if (
    normCountry.includes('argentina') &&
    (normState.includes('misiones') || normState.includes('corrientes') || normState.includes('entre rios') || normState.includes('santa fe'))
  ) {
    return 'Litoral Argentino (Cuenca del Plata)';
  }

  // Sierras de Córdoba
  if (normCountry.includes('argentina') && (normState.includes('cordoba') || normState.includes('san luis'))) {
    return 'Sierras de Córdoba y Cuyo Central';
  }

  // Cuyo / Mendoza
  if (normCountry.includes('argentina') && (normState.includes('mendoza') || normState.includes('san juan'))) {
    return 'Región de Cuyo y Precordillera de los Andes';
  }

  // Patagonia
  if (
    normCountry.includes('argentina') &&
    (normState.includes('rio negro') || normState.includes('neuquen') || normState.includes('chubut') || normState.includes('santa cruz') || normState.includes('tierra del fuego'))
  ) {
    return 'Patagonia Andina y Austral';
  }

  // Brasil
  if (normCountry.includes('brasil') || normCountry.includes('brazil')) {
    if (normState.includes('rio de janeiro') || normName.includes('rio de janeiro')) {
      if (normName.includes('cabo frio') || normName.includes('buzios') || normName.includes('búzios') || normName.includes('arraial')) {
        return 'Região dos Lagos (Costa de Río de Janeiro, Brasil)';
      }
      if (normName.includes('angra') || normName.includes('paraty') || normName.includes('ilha grande')) {
        return 'Costa Verde (Litoral de Río de Janeiro, Brasil)';
      }
      return 'Sudeste de Brasil (Costa de Río de Janeiro)';
    }
    if (normState.includes('santa catarina') || normName.includes('santa catarina')) {
      return 'Sur de Brasil (Costa de Santa Catarina)';
    }
    if (normState.includes('rio grande do sul')) return 'Sur de Brasil (Región Gaúcha)';
    if (normState.includes('bahia') || normName.includes('bahia')) return 'Nordeste de Brasil (Litoral Bahiano)';
    if (normState.includes('ceara') || normState.includes('rio grande do norte')) return 'Norte y Nordeste Septentrional de Brasil';
    return 'Brasil';
  }

  // Uruguay
  if (normCountry.includes('uruguay')) {
    if (normName.includes('maldonado') || normName.includes('punta') || normName.includes('rocha')) {
      return 'Costa Atlántica de Uruguay';
    }
    return 'Uruguay y Río de la Plata';
  }

  // Chile
  if (normCountry.includes('chile')) {
    if (lat >= -36.5 && lat <= -30.0) return 'Chile Central y Región Metropolitana';
    if (lat < -36.5) return 'Sur y Patagonia Chilena';
    return 'Norte y Desierto de Chile';
  }

  // Caribe
  if (
    (lat >= 9.0 && lat <= 26.0 && lng >= -90.0 && lng <= -60.0) ||
    normCountry.includes('mexico') || normCountry.includes('dominicana') || normCountry.includes('cuba')
  ) {
    return 'Cuenca del Caribe y Centroamérica';
  }

  // Florida / USA
  if (normCountry.includes('estados unidos') || normCountry.includes('united states')) {
    if (normState.includes('florida')) return 'Península de Florida (Sur de EE. UU.)';
    if (normState.includes('california')) return 'Costa de California (Oeste de EE. UU.)';
    return `${state || 'Estados Unidos'}`;
  }

  // Default fallback
  if (state && country) return `${state}, ${country}`;
  if (country) return country;
  return 'Zona Geográfica Global';
}

// Find matching NOAA Zone by coordinates
export function findNoaaZoneForCoords(coords: [number, number], season: SeasonKey): NoaaZone | null {
  const seasonZones = NOAA_ZONES.filter(z => z.season === season);
  
  // 1. Strict point in polygon
  for (const zone of seasonZones) {
    if (isPointInPolygon(coords, zone.polygon)) {
      return zone;
    }
  }

  // 2. Buffer distance match (within ~1.2 degrees lat/lon of polygon boundary)
  for (const zone of seasonZones) {
    for (const [vLat, vLng] of zone.polygon) {
      const dist = Math.hypot(coords[0] - vLat, coords[1] - vLng);
      if (dist < 1.4) {
        return zone;
      }
    }
  }

  return null;
}

// Generate rich explanation when destination is outside direct NOAA anomaly
export function generateNeutralPrognosis(
  destName: string,
  zone: string,
  coords: [number, number],
  season: SeasonKey,
  customNoteDJF?: string,
  customNoteJJA?: string
): { summary: string; detailed: string; advice: string; packing: string } {
  const seasonTitle = season === 'DJF' 
    ? 'Diciembre a Febrero (Verano austral / Invierno boreal)' 
    : 'Junio a Agosto (Invierno austral / Verano boreal)';

  if (season === 'DJF' && customNoteDJF) {
    return {
      summary: `Zona sin señal o anomalía directa determinante de El Niño durante ${seasonTitle}.`,
      detailed: customNoteDJF,
      advice: 'Organiza tu viaje según las pautas climáticas habituales de la región. El Niño no altera de manera estadísticamente uniforme esta zona en esta época.',
      packing: 'Indumentaria adecuada a la amplitud térmica habitual del destino y calzado cómodo para excursiones.'
    };
  }

  if (season === 'JJA' && customNoteJJA) {
    return {
      summary: `Zona sin señal o anomalía directa determinante de El Niño durante ${seasonTitle}.`,
      detailed: customNoteJJA,
      advice: 'Planifica tus actividades basándote en la climatología estacional promedio y el pronóstico local a corto plazo.',
      packing: 'Ropa por capas adecuada a la estación del destino.'
    };
  }

  const [lat] = coords;
  const isSouthernHemisphere = lat < 0;
  const hemisphereSeason = isSouthernHemisphere 
    ? (season === 'DJF' ? 'verano austral' : 'invierno austral')
    : (season === 'DJF' ? 'invierno boreal' : 'verano boreal');

  return {
    summary: `Esta localidad se encuentra fuera de las franjas de anomalía directa documentadas por NOAA para El Niño en el período de ${seasonTitle}.`,
    detailed: `Para ${destName} (${zone}), los modelos climáticos globales no muestran un patrón sistemático de exceso o déficit pluvial/térmico ligado directamente a la fase cálida del ENSO. En cambio, su tiempo meteorológico se rige por su climatología estacional típica (${hemisphereSeason}) y por los sistemas frontales o presiones sinópticas locales.`,
    advice: 'Puedes planificar tus vacaciones con normalidad tomando como referencia los promedios históricos de temperatura y precipitación del lugar, y monitoreando el pronóstico meteorológico oficial local con 3 a 7 días de antelación.',
    packing: 'Ropa versátil adaptada a la estación habitual del lugar y elementos básicos de viaje (protector solar, abrigo intermedio para la noche y calzado cómodo).'
  };
}

// Search curated database first - strictly respecting specific localities
export function searchCuratedDatabase(query: string): DestinationInfo | null {
  const normQ = normalizeStr(query);
  if (!normQ) return null;

  // 1. Exact match on name or id
  const exact = CURATED_DESTINATIONS.find(
    d => normalizeStr(d.name) === normQ || d.id === normQ
  );
  if (exact) return exact;

  // 2. Exact match on an alias
  const byExactAlias = CURATED_DESTINATIONS.find(d =>
    d.aliases.some(a => normalizeStr(a) === normQ)
  );
  if (byExactAlias) return byExactAlias;

  // 3. Prefix match on name (e.g. "cabo fri" -> "Cabo Frio")
  const prefix = CURATED_DESTINATIONS.find(d =>
    normalizeStr(d.name).startsWith(normQ)
  );
  if (prefix) return prefix;

  return null;
}

// Live OpenStreetMap Nominatim Geocoding
export async function geocodeWithNominatim(query: string): Promise<DestinationInfo | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=1`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'es,en',
        'User-Agent': 'ElNinoTourismMonitor/1.0'
      }
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const first = data[0];
    const lat = parseFloat(first.lat);
    const lon = parseFloat(first.lon);
    if (isNaN(lat) || isNaN(lon)) return null;

    const address = first.address || {};
    const country = address.country || '';
    const state = address.state || address.province || address.region || '';
    const city = address.city || address.town || address.village || address.municipality || first.name || query;

    const detectedZone = inferZoneFromAddress([lat, lon], first.display_name, country, state);

    return {
      id: `osm_${normalizeStr(city)}`,
      name: city,
      detectedZone,
      country,
      stateOrProvince: state,
      coords: [lat, lon],
      aliases: [normalizeStr(city), normalizeStr(query)],
      popular: false,
      tag: 'Localidad Detectada (OpenStreetMap)'
    };
  } catch (err) {
    console.warn('Nominatim geocode error:', err);
    return null;
  }
}

// Resolve any query to full resolution result
export async function resolveLocation(query: string, season: SeasonKey): Promise<LocationResolutionResult> {
  const trimmed = query.trim();
  
  // 1. Try curated database
  let dest = searchCuratedDatabase(trimmed);
  let source: 'curated' | 'nominatim_osm' = 'curated';

  // 2. If not found, try Nominatim OSM Geocoding
  if (!dest) {
    dest = await geocodeWithNominatim(trimmed);
    if (dest) {
      source = 'nominatim_osm';
    }
  }

  // 3. Fallback if still not found: create a simulated fallback object
  if (!dest) {
    dest = {
      id: `custom_${Date.now()}`,
      name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
      detectedZone: 'Destino no localizado exactamente en el mapa global',
      country: 'Global',
      coords: [-34.6037, -58.3816], // default reference
      aliases: [normalizeStr(trimmed)],
      popular: false,
      tag: 'Búsqueda Personalizada'
    };
  }

  // 4. Find NOAA Zone
  const noaaZone = findNoaaZoneForCoords(dest.coords, season);

  if (noaaZone) {
    return {
      query: trimmed,
      matchedName: dest.name,
      detectedZone: dest.detectedZone,
      country: dest.country,
      stateOrProvince: dest.stateOrProvince,
      coords: dest.coords,
      source,
      season,
      noaaZone,
      category: noaaZone.category,
      categoryLabel: noaaZone.categoryLabelEs,
      colorHex: noaaZone.colorHex,
      bgLightHex: noaaZone.bgLightHex,
      icon: noaaZone.icon,
      prognosisSummary: noaaZone.impactShort,
      detailedImpact: noaaZone.impactDetailed,
      touristAdvice: noaaZone.touristAdvice,
      packingAdvice: noaaZone.packingAdvice,
      isNeutral: false
    };
  }

  // Outside direct NOAA zone
  const neutralData = generateNeutralPrognosis(
    dest.name,
    dest.detectedZone,
    dest.coords,
    season,
    dest.neutralSeasonNoteDJF,
    dest.neutralSeasonNoteJJA
  );

  return {
    query: trimmed,
    matchedName: dest.name,
    detectedZone: dest.detectedZone,
    country: dest.country,
    stateOrProvince: dest.stateOrProvince,
    coords: dest.coords,
    source,
    season,
    noaaZone: null,
    category: 'Neutral',
    categoryLabel: NOAA_LEGEND.Neutral.label,
    colorHex: NOAA_LEGEND.Neutral.color,
    bgLightHex: '#f8fafc',
    icon: '🌐',
    prognosisSummary: neutralData.summary,
    detailedImpact: neutralData.detailed,
    touristAdvice: neutralData.advice,
    packingAdvice: neutralData.packing,
    isNeutral: true
  };
}
