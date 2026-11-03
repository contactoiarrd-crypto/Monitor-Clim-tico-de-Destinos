export type SeasonKey = 'DJF' | 'JJA';

export type NoaaPatternCategory = 
  | 'Wet'
  | 'Warm'
  | 'Dry'
  | 'Warm and dry'
  | 'Cool and Wet'
  | 'Cool and dry'
  | 'Warm and wet'
  | 'Neutral';

export interface NoaaZone {
  id: string;
  season: SeasonKey;
  regionName: string;
  category: NoaaPatternCategory;
  categoryLabelEs: string;
  colorHex: string;
  bgLightHex: string;
  borderHex: string;
  icon: string;
  impactShort: string;
  impactDetailed: string;
  touristAdvice: string;
  packingAdvice: string;
  // GeoJSON-like bounding box or polygon coordinates [[lat, lng], [lat, lng], ...]
  polygon: [number, number][];
}

export const NOAA_LEGEND: Record<NoaaPatternCategory, { label: string; color: string; desc: string }> = {
  'Wet': {
    label: 'Húmedo (Wet)',
    color: '#16a34a', // green
    desc: 'Precipitaciones superiores a lo normal. Mayor frecuencia de tormentas severas y crecidas.'
  },
  'Warm': {
    label: 'Cálido (Warm)',
    color: '#f97316', // orange / peach
    desc: 'Temperaturas por encima del promedio histórico. Días muy calurosos u olas de calor.'
  },
  'Dry': {
    label: 'Seco (Dry)',
    color: '#ca8a04', // khaki / golden yellow
    desc: 'Déficit de precipitaciones. Sequía estacional y supresión de frentes de lluvia habituales.'
  },
  'Warm and dry': {
    label: 'Cálido y Seco (Warm and dry)',
    color: '#b45309', // brown / amber
    desc: 'Combinación de calor anómalo y falta de lluvias. Riesgo de incendios o bajantes fluviales.'
  },
  'Cool and Wet': {
    label: 'Frío y Húmedo (Cool and Wet)',
    color: '#0f766e', // dark teal
    desc: 'Inviernos o temporadas con temperaturas más bajas de lo habitual acompañadas de lluvias frecuentes.'
  },
  'Cool and dry': {
    label: 'Frío y Seco (Cool and dry)',
    color: '#0284c7', // light blue / sky
    desc: 'Temperaturas más frescas con aire seco y menor humedad de condensación.'
  },
  'Warm and wet': {
    label: 'Cálido y Húmedo (Warm and wet)',
    color: '#84cc16', // light lime / green
    desc: 'Temperaturas oceánicas y atmosféricas elevadas con intensa convección y precipitaciones.'
  },
  'Neutral': {
    label: 'Sin señal directa de El Niño',
    color: '#64748b', // slate
    desc: 'La zona no presenta una anomalía estadística directa en el mapa de NOAA; rige su clima estacional típico.'
  }
};

export const NOAA_ZONES: NoaaZone[] = [
  // ==========================================
  // DICIEMBRE - FEBRERO (DJF)
  // ==========================================
  {
    id: 'djf_se_south_america',
    season: 'DJF',
    regionName: 'Sudeste de Sudamérica (Costa Argentina, Uruguay, Sur de Brasil, Litoral)',
    category: 'Wet',
    categoryLabelEs: 'Húmedo (Wet)',
    colorHex: '#16a34a',
    bgLightHex: '#f0fdf4',
    borderHex: '#86efac',
    icon: '🌧️⚡',
    impactShort: 'Lluvias y tormentas severas significativamente por encima de la media histórica.',
    impactDetailed: 'El fenómeno de El Niño intensifica el flujo de humedad desde el Amazonas y el Atlántico hacia la cuenca del Plata y la costa atlántica central. Se producen tormentas eléctricas intensas, frentes con abundante caída de agua en cortos períodos y crecidas de los ríos Paraná y Uruguay.',
    touristAdvice: 'Para la Costa Argentina (Mar del Plata, Villa Gesell, Pinamar) y Sur de Brasil (Florianópolis, Camboriú): los días de playa pueden ser interrumpidos por tormentas repentinas o temporales de 24 a 48 horas. Planificar un itinerario flexible con alternativas bajo techo (gastronomía, museos, compras, teatros) y verificar el estado de balnearios y rutas de acceso.',
    packingAdvice: 'Piloto o impermeable liviano, paraguas resistente al viento, calzado de secado rápido y protección impermeable para equipos electrónicos.',
    polygon: [
      [-23.0, -58.0],
      [-22.0, -50.0],
      [-25.5, -47.0],
      [-29.0, -48.0],
      [-34.0, -52.0],
      [-39.5, -57.0],
      [-41.0, -62.0],
      [-37.0, -64.0],
      [-32.0, -62.0],
      [-26.0, -60.0]
    ]
  },
  {
    id: 'djf_east_brazil',
    season: 'DJF',
    regionName: 'Este y Nordeste Costero de Brasil (Bahía, Río de Janeiro, Sudeste)',
    category: 'Warm',
    categoryLabelEs: 'Cálido (Warm)',
    colorHex: '#f97316',
    bgLightHex: '#fff7ed',
    borderHex: '#fdba74',
    icon: '🌡️☀️',
    impactShort: 'Temperaturas notoriamente más altas de lo habitual y olas de calor intensas.',
    impactDetailed: 'La circulación atmosférica promueve subsidencia y cielos despejados con fuerte radiación solar. En Río de Janeiro, Búzios, Salvador de Bahía y costas del Sudeste, se registran sensaciones térmicas que pueden superar los 40°C.',
    touristAdvice: 'Condiciones inmejorables para playa continua y deportes náuticos. Es imperativo evitar la exposición directa al sol entre las 11:00 y las 16:00, mantenerse hidratado constantemente y elegir alojamientos con aire acondicionado garantizado.',
    packingAdvice: 'Protector solar FPS 50+, sombreros de ala ancha, gafas con filtro UV, botellas térmicas y ropa de lino o telas muy transpirables.',
    polygon: [
      [-10.0, -42.0],
      [-10.0, -36.0],
      [-14.0, -38.0],
      [-19.0, -39.0],
      [-24.0, -41.0],
      [-24.5, -46.0],
      [-21.0, -46.0],
      [-15.0, -44.0]
    ]
  },
  {
    id: 'djf_north_south_america',
    season: 'DJF',
    regionName: 'Norte de Sudamérica, Cuenca Amazónica y Nordeste Septentrional',
    category: 'Dry',
    categoryLabelEs: 'Seco (Dry)',
    colorHex: '#ca8a04',
    bgLightHex: '#fefce8',
    borderHex: '#fde047',
    icon: '🍂☀️',
    impactShort: 'Déficit marcado de precipitaciones, sequías estacionales y bajantes de ríos.',
    impactDetailed: 'El desplazamiento de la zona de convergencia intertropical suprime las lluvias en el norte de Brasil (Fortaleza, Ceará, Natal), Amazonas, Colombia y Venezuela. Esto genera una marcada reducción de caudales navegables y estrés hídrico.',
    touristAdvice: 'Para destinos de sol y playa (Fortaleza, Jericoacoara, Natal), garantiza días 100% despejados y con poco viento pluvial. Si visitas la selva amazónica (Manaus), consultar navegabilidad de paseos fluviales debido a bajantes extremas.',
    packingAdvice: 'Hidratantes para la piel, bálsamo labial, gotas para ojos, vestimenta fresca y protector solar de amplio espectro.',
    polygon: [
      [12.0, -75.0],
      [11.0, -60.0],
      [5.0, -50.0],
      [-2.0, -42.0],
      [-5.0, -35.0],
      [-10.0, -37.0],
      [-10.0, -55.0],
      [-4.0, -70.0],
      [3.0, -75.0]
    ]
  },
  {
    id: 'djf_south_usa',
    season: 'DJF',
    regionName: 'Sur de EE. UU., Costa del Golfo y Norte de México (Florida, Texas, California Sur)',
    category: 'Cool and Wet',
    categoryLabelEs: 'Frío y Húmedo (Cool and Wet)',
    colorHex: '#0f766e',
    bgLightHex: '#f0fdfa',
    borderHex: '#5eead4',
    icon: '🌧️🧥',
    impactShort: 'Inviernos más frescos y con lluvias más frecuentes y tormentas severas.',
    impactDetailed: 'La corriente en chorro subtropical se intensifica y desplaza hacia el sur, canalizando frentes fríos cargados de humedad del Pacífico y del Golfo hacia California, Texas y la península de Florida.',
    touristAdvice: 'En Miami, Orlando (parques temáticos) o California: los inviernos no son tan secos y templados como en años neutros. Las mañanas y noches son más frescas y hay chaparrones periódicos que pueden pausar juegos al aire libre.',
    packingAdvice: 'Capas de abrigo (camperas ligeras cortaviento o impermeables), calzado cómodo para lluvia y paraguas para caminatas en parques.',
    polygon: [
      [36.0, -122.0],
      [34.0, -117.0],
      [30.0, -105.0],
      [31.0, -90.0],
      [30.0, -81.0],
      [24.5, -80.0],
      [27.5, -83.0],
      [28.0, -97.0],
      [29.0, -103.0],
      [32.0, -116.0]
    ]
  },
  {
    id: 'djf_northwest_na',
    season: 'DJF',
    regionName: 'Noroeste de Norteamérica y Alaska (Canadá Occidental y Pacífico Noroeste)',
    category: 'Warm',
    categoryLabelEs: 'Cálido (Warm)',
    colorHex: '#f97316',
    bgLightHex: '#fff7ed',
    borderHex: '#fdba74',
    icon: '🌡️🏔️',
    impactShort: 'Inviernos anómalamente suaves y temperaturas por encima de la media.',
    impactDetailed: 'Vancouver, Seattle y zonas de Alaska experimentan temperaturas invernales más moderadas, con menor acumulación de nieve en cotas bajas y medias.',
    touristAdvice: 'Para centros de esquí (Whistler, Rocosas Canadienses), verificar estado de pistas y cotas de congelación, ya que puede haber más deshielo temprano o lluvia en bases.',
    packingAdvice: 'Ropa técnica en capas impermeables más que excesivamente térmicas pesadas.',
    polygon: [
      [68.0, -165.0],
      [68.0, -135.0],
      [55.0, -120.0],
      [45.0, -115.0],
      [45.0, -125.0],
      [58.0, -145.0],
      [62.0, -165.0]
    ]
  },
  {
    id: 'djf_se_asia_indonesia',
    season: 'DJF',
    regionName: 'Sudeste Asiático e Indonesia (Bali, Tailandia, Filipinas, Singapur)',
    category: 'Warm and dry',
    categoryLabelEs: 'Cálido y Seco (Warm and dry)',
    colorHex: '#b45309',
    bgLightHex: '#fdf8f6',
    borderHex: '#fdba74',
    icon: '🔥☀️',
    impactShort: 'Calor elevado y déficit notable de lluvias estacionales.',
    impactDetailed: 'La convección ecuatorial se desplaza al este del Pacífico, dejando a Indonesia, Filipinas y el sudeste asiático con condiciones mucho más secas y cálidas.',
    touristAdvice: 'Favorable para playas y buceo en Bali y Tailandia por menor nubosidad, pero con riesgo de bruma o humo ("haze") por incendios forestales. Monitorear calidad del aire (AQI).',
    packingAdvice: 'Ropa ligera de algodón o bambú, protector solar intenso, mascarilla N95 por precaución ante calima o polución.',
    polygon: [
      [22.0, 95.0],
      [22.0, 125.0],
      [10.0, 130.0],
      [-10.0, 130.0],
      [-10.0, 100.0],
      [5.0, 95.0]
    ]
  },
  {
    id: 'djf_east_africa',
    season: 'DJF',
    regionName: 'África Oriental (Kenia, Tanzania, Uganda, Zanzíbar)',
    category: 'Wet',
    categoryLabelEs: 'Húmedo (Wet)',
    colorHex: '#16a34a',
    bgLightHex: '#f0fdf4',
    borderHex: '#86efac',
    icon: '🌧️🚙',
    impactShort: 'Precipitaciones abundantes y crecidas en ríos y llanuras.',
    impactDetailed: 'Intensa ciclogénesis y aporte de humedad del océano Índico generan copiosas lluvias en la región del Rift y llanuras del Serengeti.',
    touristAdvice: 'Safaris: caminos de tierra pueden volverse intransitables; indispensable contratar operadores con vehículos 4x4 pesados y seguro de viaje robusto.',
    packingAdvice: 'Botas impermeables o de trekking con buen agarre, repelente de insectos extra fuerte y prendas de secado veloz.',
    polygon: [
      [5.0, 32.0],
      [5.0, 42.0],
      [-8.0, 41.0],
      [-8.0, 31.0]
    ]
  },
  {
    id: 'djf_southern_africa',
    season: 'DJF',
    regionName: 'África Austral (Sudáfrica, Zimbabue, Namibia, Botsuana, Cataratas Victoria)',
    category: 'Warm and dry',
    categoryLabelEs: 'Cálido y Seco (Warm and dry)',
    colorHex: '#b45309',
    bgLightHex: '#fdf8f6',
    borderHex: '#fdba74',
    icon: '🏜️🔥',
    impactShort: 'Verano austral con calor agobiante y sequía severa.',
    impactDetailed: 'Mermas importantes en caudales fluviales de los ríos Zambeze y Limpopo, afectando el caudal escénico de Cataratas Victoria.',
    touristAdvice: 'Excelente para avistamiento de fauna (safaris en Kruger o Chobe) ya que los animales se congregan en aguadas puntuales. Prever hidratación extrema.',
    packingAdvice: 'Sombrero safari con barbijo para viento, cantimplora con filtro o botella térmica grande y sales de rehidratación oral.',
    polygon: [
      [-15.0, 15.0],
      [-15.0, 35.0],
      [-34.0, 32.0],
      [-34.0, 18.0]
    ]
  },
  {
    id: 'djf_se_australia',
    season: 'DJF',
    regionName: 'Sudeste de Australia (Sídney, Melbourne, Adelaida, Brisbane)',
    category: 'Warm',
    categoryLabelEs: 'Cálido (Warm)',
    colorHex: '#f97316',
    bgLightHex: '#fff7ed',
    borderHex: '#fdba74',
    icon: '🌡️🔥',
    impactShort: 'Olas de calor veraniegas y temperaturas superiores a la media histórica.',
    impactDetailed: 'Persistencia de masas de aire caliente provenientes del desierto interior, elevando el peligro de incendios forestales ("bushfires").',
    touristAdvice: 'Seguir las alertas de riesgo de fuego de los servicios rurales (RFS/CFA) y disfrutar de playas urbanas respetando zonas de baño balizadas.',
    packingAdvice: 'Protección solar extrema (el índice UV en Australia es de los más altos del planeta), gafas de sol polarizadas y ropa fresca.',
    polygon: [
      [-26.0, 145.0],
      [-26.0, 154.0],
      [-38.0, 150.0],
      [-38.0, 140.0],
      [-32.0, 137.0]
    ]
  },

  // ==========================================
  // JUNIO - AGOSTO (JJA)
  // ==========================================
  {
    id: 'jja_central_chile',
    season: 'JJA',
    regionName: 'Chile Central y Cordillera Andina Central (Santiago, Valparaíso, Viña del Mar, Centros de Esquí)',
    category: 'Wet',
    categoryLabelEs: 'Húmedo (Wet)',
    colorHex: '#16a34a',
    bgLightHex: '#f0fdf4',
    borderHex: '#86efac',
    icon: '🌧️🏔️',
    impactShort: 'Mayor recurrencia de temporales de lluvia costeros y abundantes nevadas en alta cordillera.',
    impactDetailed: 'El debilitamiento del anticiclón del Pacífico permite el ingreso de sistemas frontales cargados de humedad hacia las regiones de Valparaíso, Metropolitana y O\'Higgins.',
    touristAdvice: 'Temporada excepcional para amantes del esquí y snowboard (Valle Nevado, Portillo, La Parva). En ciudades y costas, prever demoras en pasos internacionales (Cristo Redentor) por cierres por temporales de nieve.',
    packingAdvice: 'Ropa de nieve impermeable, cadenas para vehículos si se sube a la montaña, paraguas para ciudades y botas térmicas.',
    polygon: [
      [-30.0, -73.0],
      [-30.0, -69.5],
      [-36.5, -70.0],
      [-36.5, -73.5]
    ]
  },
  {
    id: 'jja_peru_ecuador',
    season: 'JJA',
    regionName: 'Costa y Sierra de Perú y Ecuador (Lima, Máncora, Trujillo, Galápagos, Guayaquil, Quito)',
    category: 'Warm',
    categoryLabelEs: 'Cálido (Warm)',
    colorHex: '#f97316',
    bgLightHex: '#fff7ed',
    borderHex: '#fdba74',
    icon: '🌡️☀️',
    impactShort: 'Inviernos costeros atípicamente templados y aguas marinas más cálidas.',
    impactDetailed: 'La llegada de ondas Kelvin cálidas eleva la temperatura superficial del mar (TSM) frente a las costas peruanas y ecuatorianas, disipando la clásica "garúa" invernal y aportando días más soleados y cálidos.',
    touristAdvice: 'Excelente para turismo de playa en el norte (Máncora) y paseos urbanos en Lima sin el habitual frío húmedo grisáceo. En la sierra andina (Cusco), días agradables y noches frías por gran amplitud térmica.',
    packingAdvice: 'Ropa liviana para el día y abrigo intermedio (polar o suéter) para las noches andinas.',
    polygon: [
      [2.0, -82.0],
      [1.0, -76.0],
      [-14.0, -73.0],
      [-17.0, -72.0],
      [-15.0, -77.0],
      [-4.0, -82.0]
    ]
  },
  {
    id: 'jja_central_east_brazil',
    season: 'JJA',
    regionName: 'Centro y Este de Brasil (Río de Janeiro, São Paulo, Brasilia, Belo Horizonte)',
    category: 'Warm',
    categoryLabelEs: 'Cálido (Warm)',
    colorHex: '#f97316',
    bgLightHex: '#fff7ed',
    borderHex: '#fdba74',
    icon: '🌡️🌴',
    impactShort: 'Inviernos secos con temperaturas primaverales o veraniegas fuera de estación.',
    impactDetailed: 'Los frentes fríos polares no logran penetrar con fuerza al continente sudamericano, reteniendo masas de aire cálido subtropical.',
    touristAdvice: 'Condiciones magníficas para turismo cultural, gastronómico y playa en Río de Janeiro sin el calor extremo del verano ni el frío del invierno tradicional.',
    packingAdvice: 'Indumentaria primaveral cómoda, traje de baño para días de sol y un abrigo muy liviano para la noche.',
    polygon: [
      [-12.0, -50.0],
      [-12.0, -38.0],
      [-23.0, -40.0],
      [-24.0, -48.0],
      [-18.0, -52.0]
    ]
  },
  {
    id: 'jja_caribbean_north_sa',
    season: 'JJA',
    regionName: 'Caribe, Centroamérica y Norte de Sudamérica (Cancún, Riviera Maya, Punta Cana, Cuba, Costa Rica, Colombia Caribeña)',
    category: 'Warm and dry',
    categoryLabelEs: 'Cálido y Seco (Warm and dry)',
    colorHex: '#b45309',
    bgLightHex: '#fdf8f6',
    borderHex: '#fdba74',
    icon: '☀️🏖️',
    impactShort: 'Verano boreal más caluroso y con menor humedad pluvial.',
    impactDetailed: 'El fenómeno de El Niño incrementa la cizalladura vertical del viento en la cuenca del Atlántico tropical, lo que históricamente inhibe el desarrollo de ondas tropicales y reduce la frecuencia global de huracanes en el Caribe.',
    touristAdvice: 'Noticia favorable para vacacionar en playas caribeñas (Cancún, Punta Cana, Cartagena) al disminuir el riesgo estadístico de huracanes intensos. Sin embargo, el calor diurno es agobiante, por lo que se requiere protección térmica rigurosa.',
    packingAdvice: 'Protector solar resistente al agua, trajes de baño con protección UV, gafas de sol y ropa ligera y fresca.',
    polygon: [
      [25.0, -88.0],
      [22.0, -65.0],
      [15.0, -60.0],
      [8.0, -60.0],
      [7.0, -83.0],
      [15.0, -88.0],
      [22.0, -90.0]
    ]
  },
  {
    id: 'jja_indonesia_north_australia',
    season: 'JJA',
    regionName: 'Indonesia y Norte de Australia (Bali, Darwin, Cairns)',
    category: 'Dry',
    categoryLabelEs: 'Seco (Dry)',
    colorHex: '#ca8a04',
    bgLightHex: '#fefce8',
    borderHex: '#fde047',
    icon: '🍂☀️',
    impactShort: 'Estación seca intensificada con ambiente árido y ausencia casi total de lluvias.',
    impactDetailed: 'Continúa el déficit de humedad y la compresión anticiclónica en el norte de Australia y archipiélago indonesio.',
    touristAdvice: 'Ideal para actividades ecoturísticas, playas, templos y buceo. Asegurarse hidratación constante en excursiones al aire libre.',
    packingAdvice: 'Protector solar, cantimplora reutilizable, ropa de trekking ligera y repelente.',
    polygon: [
      [-6.0, 110.0],
      [-6.0, 140.0],
      [-20.0, 145.0],
      [-22.0, 125.0],
      [-12.0, 115.0]
    ]
  },
  {
    id: 'jja_new_zealand',
    season: 'JJA',
    regionName: 'Nueva Zelanda y Sudoeste del Pacífico',
    category: 'Cool and dry',
    categoryLabelEs: 'Frío y Seco (Cool and dry)',
    colorHex: '#0284c7',
    bgLightHex: '#f0f9ff',
    borderHex: '#7dd3fc',
    icon: '❄️🧥',
    impactShort: 'Inviernos más fríos de lo normal con vientos del sudoeste y menor humedad.',
    impactDetailed: 'Sistemas polares avanzan desde el océano Austral hacia las islas Norte y Sur de Nueva Zelanda.',
    touristAdvice: 'Excelente para temporada de esquí en Queenstown y Wanaka; requiere ropa técnica para bajas temperaturas extremas.',
    packingAdvice: 'Camperas térmicas de pluma, ropa interior de lana merino, guantes, gorro y botas de nieve.',
    polygon: [
      [-33.0, 165.0],
      [-33.0, 179.0],
      [-48.0, 179.0],
      [-48.0, 165.0]
    ]
  }
];
