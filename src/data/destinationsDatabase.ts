export interface DestinationInfo {
  id: string;
  name: string; // "Mar del Plata"
  detectedZone: string; // "Costa Argentina / Costa Atlántica"
  country: string; // "Argentina"
  stateOrProvince?: string; // "Buenos Aires"
  coords: [number, number]; // [lat, lng]
  aliases: string[]; // for fuzzy search
  popular: boolean;
  tag?: string; // e.g. "Playa", "Nieve / Montaña", "Selva", "Ciudad"
  // Specific contextual notes for when this destination is outside direct NOAA zone
  neutralSeasonNoteDJF?: string;
  neutralSeasonNoteJJA?: string;
}

export const CURATED_DESTINATIONS: DestinationInfo[] = [
  // ==========================================
  // COSTA ARGENTINA & BUENOS AIRES
  // ==========================================
  {
    id: 'mar_del_plata',
    name: 'Mar del Plata',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-38.0055, -57.5426],
    aliases: ['mar del plata', 'mardel', 'la feliz', 'mdq', 'costa argentina', 'playa mar del plata'],
    popular: true,
    tag: 'Playa & Ciudad Costera'
  },
  {
    id: 'pinamar',
    name: 'Pinamar',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-37.1084, -56.8584],
    aliases: ['pinamar', 'carilo', 'cariló', 'valeria del mar', 'ostende', 'costa argentina'],
    popular: true,
    tag: 'Playa & Bosque'
  },
  {
    id: 'villa_gesell',
    name: 'Villa Gesell',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-37.2639, -56.9731],
    aliases: ['villa gesell', 'gesell', 'mar de las pampas', 'las gaviotas', 'mar azul', 'costa argentina'],
    popular: true,
    tag: 'Playa'
  },
  {
    id: 'miramar',
    name: 'Miramar',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-38.2731, -57.8344],
    aliases: ['miramar', 'mar del sur', 'costa argentina'],
    popular: false,
    tag: 'Playa'
  },
  {
    id: 'necochea',
    name: 'Necochea',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-38.5545, -58.7396],
    aliases: ['necochea', 'quequen', 'quequén', 'costa argentina'],
    popular: false,
    tag: 'Playa'
  },
  {
    id: 'partido_de_la_costa',
    name: 'Partido de La Costa (San Bernardo / San Clemente)',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-36.6872, -56.6908],
    aliases: ['san bernardo', 'san clemente', 'san clemente del tuyu', 'mar de ajo', 'mar de ajó', 'santa teresita', 'mar del tuyu', 'costa del este', 'costa argentina'],
    popular: true,
    tag: 'Playa'
  },
  {
    id: 'monte_hermoso',
    name: 'Monte Hermoso',
    detectedZone: 'Costa Argentina (Costa Atlántica Sur Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-38.9833, -61.2833],
    aliases: ['monte hermoso', 'pehuen co', 'claromeco', 'claromecó', 'costa argentina'],
    popular: false,
    tag: 'Playa'
  },
  {
    id: 'buenos_aires',
    name: 'Buenos Aires (CABA / AMBA)',
    detectedZone: 'Río de la Plata y Región Metropolitana',
    country: 'Argentina',
    stateOrProvince: 'Ciudad Autónoma de Buenos Aires',
    coords: [-34.6037, -58.3816],
    aliases: ['buenos aires', 'caba', 'capital federal', 'tigre', 'san isidro', 'la plata', 'delta'],
    popular: true,
    tag: 'Metrópolis Urbana & Cultura'
  },

  // ==========================================
  // LITORAL ARGENTINO & CUENCA DEL PLATA
  // ==========================================
  {
    id: 'iguazu',
    name: 'Cataratas del Iguazú / Puerto Iguazú',
    detectedZone: 'Litoral y Selva Misionera (Cuenca del Plata)',
    country: 'Argentina',
    stateOrProvince: 'Misiones',
    coords: [-25.5976, -54.5779],
    aliases: ['iguazu', 'iguazú', 'cataratas', 'cataratas del iguazu', 'puerto iguazu', 'foz do iguacu', 'misiones'],
    popular: true,
    tag: 'Naturaleza & Maravilla del Mundo'
  },
  {
    id: 'rosario',
    name: 'Rosario / Ribera del Paraná',
    detectedZone: 'Litoral Sur y Ribera del Paraná',
    country: 'Argentina',
    stateOrProvince: 'Santa Fe',
    coords: [-32.9468, -60.6393],
    aliases: ['rosario', 'santa fe', 'san nicolas', 'parana'],
    popular: false,
    tag: 'Río & Gastronomía'
  },
  {
    id: 'entre_rios_termas',
    name: 'Colón / Gualeguaychú (Entre Ríos)',
    detectedZone: 'Litoral del Río Uruguay (Entre Ríos)',
    country: 'Argentina',
    stateOrProvince: 'Entre Ríos',
    coords: [-32.2228, -58.1439],
    aliases: ['colon', 'colón', 'gualeguaychu', 'gualeguaychú', 'concordia', 'federacion', 'federación', 'entre rios'],
    popular: true,
    tag: 'Termas & Playas de Río'
  },
  {
    id: 'esteros_del_ibera',
    name: 'Esteros del Iberá',
    detectedZone: 'Litoral y Humedales de Corrientes',
    country: 'Argentina',
    stateOrProvince: 'Corrientes',
    coords: [-28.5144, -57.1994],
    aliases: ['esteros del ibera', 'esteros del iberá', 'ibera', 'corrientes', 'carlos pellegrini'],
    popular: false,
    tag: 'Ecoturismo & Fauna'
  },

  // ==========================================
  // PATAGONIA & CUYO (Zonas con climatología específica)
  // ==========================================
  {
    id: 'bariloche',
    name: 'Bariloche (San Carlos de Bariloche)',
    detectedZone: 'Patagonia Andina y Región de los Lagos',
    country: 'Argentina',
    stateOrProvince: 'Río Negro',
    coords: [-41.1335, -71.3103],
    aliases: ['bariloche', 'san carlos de bariloche', 'villa la angostura', 'villa traful', 'el bolson', 'el bolsón', 'esquel', 'san martin de los andes', 'san martín de los andes'],
    popular: true,
    tag: 'Montaña, Nieve & Lagos',
    neutralSeasonNoteDJF: 'En verano (Diciembre-Febrero), la Patagonia Andina goza de su mejor época: días largos, soleados, muy baja humedad y vientos moderados del oeste. Espléndido para trekking, navegación lacustre y playas de lago.',
    neutralSeasonNoteJJA: 'En invierno (Junio-Agosto), predominan los sistemas frontales polares antárticos con bajas temperaturas y nevadas frecuentes en Cerro Catedral y cerros andinos, ideales para esquí y turismo invernal.'
  },
  {
    id: 'el_calafate',
    name: 'El Calafate / Glaciar Perito Moreno',
    detectedZone: 'Patagonia Austral y Parque Nacional Los Glaciares',
    country: 'Argentina',
    stateOrProvince: 'Santa Cruz',
    coords: [-50.3378, -72.2648],
    aliases: ['el calafate', 'calafate', 'glaciar perito moreno', 'el chalten', 'el chaltén', 'chalten'],
    popular: true,
    tag: 'Glaciares & Trekking',
    neutralSeasonNoteDJF: 'Temporada alta de trekking. Mucha luz diurna (hasta las 22 hs), vientos patagónicos intensos y temperaturas templadas de día (15-20°C). Se rige por los vientos del oeste y el campo de hielo.',
    neutralSeasonNoteJJA: 'Invierno patagónico: muy frío, días cortos, heladas y nieve en estepa. Servicios reducidos pero paisajes vírgenes congelados.'
  },
  {
    id: 'ushuaia',
    name: 'Ushuaia (Fin del Mundo)',
    detectedZone: 'Tierra del Fuego y Canal Beagle',
    country: 'Argentina',
    stateOrProvince: 'Tierra del Fuego',
    coords: [-54.8019, -68.3030],
    aliases: ['ushuaia', 'fin del mundo', 'tierra del fuego', 'canal beagle', 'cerro castor'],
    popular: true,
    tag: 'Fin del Mundo & Esquí',
    neutralSeasonNoteDJF: 'Verano fueguino: clima oceánico subpolar, días muy extensos de casi 18 horas de luz, temperaturas suaves (10-14°C) con cambios meteorológicos rápidos.',
    neutralSeasonNoteJJA: 'Invierno con la nieve más estable y de mejor calidad de Sudamérica en Cerro Castor, paseos en trineo y navegación invernal.'
  },
  {
    id: 'mendoza',
    name: 'Mendoza / Valle de Uco',
    detectedZone: 'Región de Cuyo y Ruta del Vino',
    country: 'Argentina',
    stateOrProvince: 'Mendoza',
    coords: [-32.8895, -68.8458],
    aliases: ['mendoza', 'valle de uco', 'san rafael', 'potrerillos', 'aconcagua', 'san juan', 'cuyo'],
    popular: true,
    tag: 'Vinos & Precordillera',
    neutralSeasonNoteDJF: 'Verano cuyano: caluroso y semiárido, con fuerte radiación solar. Hacia la tarde/noche pueden darse tormentas orográficas convectivas aisladas, a menudo con granizo.',
    neutralSeasonNoteJJA: 'Invierno seco y soleado de día, con noches muy frías (heladas). En alta cordillera, los temporales pueden dejar abundante nieve (aprovechable en Las Leñas).'
  },
  {
    id: 'cordoba_sierras',
    name: 'Villa Carlos Paz / Sierras de Córdoba',
    detectedZone: 'Sierras de Córdoba y Valles Serranos',
    country: 'Argentina',
    stateOrProvince: 'Córdoba',
    coords: [-31.4208, -64.4992],
    aliases: ['villa carlos paz', 'carlos paz', 'cordoba', 'córdoba', 'villa general belgrano', 'la cumbrecita', 'mina clavero', 'calamuchita', 'traslasierra', 'sierras'],
    popular: true,
    tag: 'Sierras, Ríos & Festivales',
    neutralSeasonNoteDJF: 'Verano serrano clásico: calor diurno, balnearios de río colmados y episodios de tormentas orográficas que provocan repentinas crecidas en ríos serranos.',
    neutralSeasonNoteJJA: 'Invierno seco, cielo azul diáfano, días templados al sol y noches frías con heladas ocasionales.'
  },
  {
    id: 'salta_jujuy',
    name: 'Salta y Jujuy (NOA / Quebrada)',
    detectedZone: 'Noroeste Argentino (NOA y Quebrada de Humahuaca)',
    country: 'Argentina',
    stateOrProvince: 'Salta / Jujuy',
    coords: [-24.7821, -65.4232],
    aliases: ['salta', 'jujuy', 'purmamarca', 'tilcara', 'humahuaca', 'cafayate', 'cachi', 'noa', 'quebrada'],
    popular: true,
    tag: 'Historia, Paisajes & Folclore',
    neutralSeasonNoteDJF: 'Época estival de lluvias en el NOA: temporada en que se concentran las precipitaciones anuales, con posibles cortes temporales en caminos de montaña por aluviones.',
    neutralSeasonNoteJJA: 'Temporada seca y óptima para recorrer el NOA: cielos 100% despejados, sol radiante de día y frío intenso de noche en la Puna y Quebrada.'
  },

  // ==========================================
  // BRASIL (Litoral Sur, Sudeste, Nordeste)
  // ==========================================
  {
    id: 'florianopolis',
    name: 'Florianópolis (Floripa / Santa Catarina)',
    detectedZone: 'Sur de Brasil (Costa de Santa Catarina)',
    country: 'Brasil',
    stateOrProvince: 'Santa Catarina',
    coords: [-27.5954, -48.5480],
    aliases: ['florianopolis', 'florianópolis', 'floripa', 'camboriu', 'camboriú', 'balneario camboriu', 'bombinhas', 'garopaba', 'praia do rosa', 'itapema', 'porto belo', 'santa catarina'],
    popular: true,
    tag: 'Playas, Surf & Vida Nocturna'
  },
  {
    id: 'rio_de_janeiro',
    name: 'Río de Janeiro',
    detectedZone: 'Sudeste de Brasil (Costa Carioca)',
    country: 'Brasil',
    stateOrProvince: 'Rio de Janeiro',
    coords: [-22.9068, -43.1729],
    aliases: ['rio de janeiro', 'río de janeiro', 'rio', 'buzios', 'búzios', 'arraial do cabo', 'cabo frio', 'angra dos reis', 'ilha grande', 'paraty'],
    popular: true,
    tag: 'Playas Icónicas & Fiesta'
  },
  {
    id: 'salvador_bahia',
    name: 'Salvador de Bahía / Porto Seguro',
    detectedZone: 'Nordeste de Brasil (Litoral de Bahía)',
    country: 'Brasil',
    stateOrProvince: 'Bahia',
    coords: [-12.9777, -38.5016],
    aliases: ['salvador de bahia', 'salvador', 'bahia', 'bahía', 'porto seguro', 'trancoso', 'arraial dajuda', 'morro de sao paulo', 'morro de são paulo', 'praia do forte'],
    popular: true,
    tag: 'Cultura Afro-Brasileña & Playa'
  },
  {
    id: 'fortaleza_ceara',
    name: 'Fortaleza / Jericoacoara (Ceará)',
    detectedZone: 'Norte y Nordeste Septentrional de Brasil',
    country: 'Brasil',
    stateOrProvince: 'Ceará',
    coords: [-3.7319, -38.5267],
    aliases: ['fortaleza', 'jericoacoara', 'jeri', 'canoa quebrada', 'ceara', 'ceará', 'natal', 'pipa'],
    popular: true,
    tag: 'Dunas, Viento & Kitesurf'
  },
  {
    id: 'recife_maceio',
    name: 'Maceió / Recife / Porto de Galinhas',
    detectedZone: 'Nordeste Oriental de Brasil (Piscinas Naturales)',
    country: 'Brasil',
    stateOrProvince: 'Alagoas / Pernambuco',
    coords: [-9.6658, -35.7351],
    aliases: ['maceio', 'maceió', 'maragogi', 'recife', 'porto de galinhas', 'alagoas', 'pernambuco'],
    popular: true,
    tag: 'Playas Turquesa & Arrecifes'
  },

  // ==========================================
  // URUGUAY
  // ==========================================
  {
    id: 'punta_del_este',
    name: 'Punta del Este / José Ignacio',
    detectedZone: 'Costa de Uruguay (Atlántico y Río de la Plata)',
    country: 'Uruguay',
    stateOrProvince: 'Maldonado',
    coords: [-34.9667, -54.9500],
    aliases: ['punta del este', 'punta', 'jose ignacio', 'josé ignacio', 'la barra', 'maldonado', 'piriapolis', 'piriápolis'],
    popular: true,
    tag: 'Playa Exclusiva & Gastronomía'
  },
  {
    id: 'montevideo',
    name: 'Montevideo / Colonia del Sacramento',
    detectedZone: 'Costa de Uruguay y Río de la Plata',
    country: 'Uruguay',
    stateOrProvince: 'Montevideo / Colonia',
    coords: [-34.9011, -56.1645],
    aliases: ['montevideo', 'colonia', 'colonia del sacramento', 'rocha', 'la paloma', 'cabo polonio', 'punta del diablo'],
    popular: false,
    tag: 'Historia, Rambla & Playas'
  },

  // ==========================================
  // CHILE
  // ==========================================
  {
    id: 'santiago_chile',
    name: 'Santiago / Valparaíso / Viña del Mar',
    detectedZone: 'Chile Central y Costa del Pacífico',
    country: 'Chile',
    stateOrProvince: 'Región Metropolitana / Valparaíso',
    coords: [-33.4489, -70.6693],
    aliases: ['santiago', 'santiago de chile', 'valparaiso', 'valparaíso', 'vina del mar', 'viña del mar', 'valle nevado', 'portillo', 'la parva', 'farellones'],
    popular: true,
    tag: 'Esquí en Invierno & Costa'
  },
  {
    id: 'atacama',
    name: 'San Pedro de Atacama',
    detectedZone: 'Desierto de Atacama (Norte de Chile)',
    country: 'Chile',
    stateOrProvince: 'Antofagasta',
    coords: [-22.9087, -68.1997],
    aliases: ['san pedro de atacama', 'atacama', 'valle de la luna'],
    popular: false,
    tag: 'Desierto, Salares & Astronomía'
  },

  // ==========================================
  // PERÚ & ECUADOR
  // ==========================================
  {
    id: 'lima_peru',
    name: 'Lima / Costa de Perú',
    detectedZone: 'Costa Central de Perú',
    country: 'Perú',
    stateOrProvince: 'Lima',
    coords: [-12.0464, -77.0428],
    aliases: ['lima', 'miraflores', 'peru', 'perú', 'paracas', 'trujillo', 'mancora', 'máncora'],
    popular: true,
    tag: 'Gastronomía de Clase Mundial'
  },
  {
    id: 'cusco_machu_picchu',
    name: 'Cusco / Machu Picchu',
    detectedZone: 'Andes del Sur de Perú',
    country: 'Perú',
    stateOrProvince: 'Cusco',
    coords: [-13.5319, -71.9675],
    aliases: ['cusco', 'cuzco', 'machu picchu', 'valle sagrado'],
    popular: true,
    tag: 'Arqueología & Cultura Inca'
  },

  // ==========================================
  // CARIBE & MÉXICO & CENTROAMÉRICA
  // ==========================================
  {
    id: 'cancun',
    name: 'Cancún / Riviera Maya (Tulum / Playa del Carmen)',
    detectedZone: 'Caribe Mexicano (Península de Yucatán)',
    country: 'México',
    stateOrProvince: 'Quintana Roo',
    coords: [21.1619, -86.8515],
    aliases: ['cancun', 'cancún', 'playa del carmen', 'tulum', 'riviera maya', 'cozumel', 'isla mujeres', 'bacalar', 'caribe'],
    popular: true,
    tag: 'Playas Turquesa, Cenotes & Ruinas'
  },
  {
    id: 'punta_cana',
    name: 'Punta Cana / Santo Domingo',
    detectedZone: 'República Dominicana (Caribe Insular)',
    country: 'República Dominicana',
    coords: [18.5601, -68.3725],
    aliases: ['punta cana', 'bavaro', 'bayahibe', 'samana', 'santo domingo', 'republica dominicana'],
    popular: true,
    tag: 'All Inclusive & Playas de Palma'
  },
  {
    id: 'cartagena',
    name: 'Cartagena de Indias / San Andrés',
    detectedZone: 'Caribe Colombiano',
    country: 'Colombia',
    stateOrProvince: 'Bolívar / San Andrés',
    coords: [10.3910, -75.4794],
    aliases: ['cartagena', 'cartagena de indias', 'san andres', 'san andrés', 'santa marta', 'parque tayrona'],
    popular: true,
    tag: 'Ciudad Amurallada & Islas'
  },
  {
    id: 'costa_rica',
    name: 'Costa Rica (Manuel Antonio / Guanacaste)',
    detectedZone: 'América Central y Playas del Pacífico/Caribe',
    country: 'Costa Rica',
    coords: [9.9281, -84.0907],
    aliases: ['costa rica', 'manuel antonio', 'guanacaste', 'tamarindo', 'san jose', 'arenal'],
    popular: true,
    tag: 'Pura Vida & Biodiversidad'
  },

  // ==========================================
  // ESTADOS UNIDOS
  // ==========================================
  {
    id: 'miami',
    name: 'Miami / Orlando (Florida)',
    detectedZone: 'Península de Florida (Sur de EE. UU.)',
    country: 'Estados Unidos',
    stateOrProvince: 'Florida',
    coords: [25.7617, -80.1918],
    aliases: ['miami', 'orlando', 'disney', 'fort lauderdale', 'key west', 'cayo hueso', 'florida', 'tampa'],
    popular: true,
    tag: 'Parques Temáticos & Playas'
  },
  {
    id: 'california',
    name: 'Los Ángeles / San Diego (California)',
    detectedZone: 'Costa de California (Costa Oeste de EE. UU.)',
    country: 'Estados Unidos',
    stateOrProvince: 'California',
    coords: [34.0522, -118.2437],
    aliases: ['los angeles', 'los ángeles', 'san diego', 'california', 'san francisco'],
    popular: true,
    tag: 'Costa del Pacífico & Cine'
  },
  {
    id: 'new_york',
    name: 'Nueva York',
    detectedZone: 'Noreste de EE. UU. (Costa Este)',
    country: 'Estados Unidos',
    stateOrProvince: 'New York',
    coords: [40.7128, -74.0060],
    aliases: ['nueva york', 'new york', 'nyc', 'manhattan'],
    popular: true,
    tag: 'Gran Metrópolis'
  },

  // ==========================================
  // ASIA & OCEANÍA
  // ==========================================
  {
    id: 'bali',
    name: 'Bali / Indonesia',
    detectedZone: 'Archipiélago de Indonesia y Sonda',
    country: 'Indonesia',
    coords: [-8.3405, 115.0920],
    aliases: ['bali', 'indonesia', 'ubud', 'seminyak', 'canggu', 'kuta', 'lombok', 'gili'],
    popular: true,
    tag: 'Templos, Arrozales & Playas'
  },
  {
    id: 'bangkok_phuket',
    name: 'Phuket / Bangkok (Tailandia)',
    detectedZone: 'Sudeste Asiático Continental',
    country: 'Tailandia',
    coords: [7.8804, 98.3923],
    aliases: ['phuket', 'bangkok', 'tailandia', 'koh samui', 'krabi', 'chiang mai'],
    popular: true,
    tag: 'Islas Exóticas & Templos'
  },
  {
    id: 'sydney',
    name: 'Sídney / Melbourne (Australia)',
    detectedZone: 'Sudeste de Australia',
    country: 'Australia',
    coords: [-33.8688, 151.2093],
    aliases: ['sydney', 'sídney', 'melbourne', 'brisbane', 'gold coast', 'australia'],
    popular: true,
    tag: 'Playas, Ópera & Naturaleza'
  },
  {
    id: 'queenstown',
    name: 'Queenstown / Nueva Zelanda',
    detectedZone: 'Sudoeste del Pacífico (Nueva Zelanda)',
    country: 'Nueva Zelanda',
    coords: [-45.0312, 168.6626],
    aliases: ['queenstown', 'auckland', 'nueva zelanda', 'new zealand'],
    popular: false,
    tag: 'Aventura, Lagos & Nieve'
  },

  // ==========================================
  // EUROPA
  // ==========================================
  {
    id: 'madrid_barcelona',
    name: 'Madrid / Barcelona / Costa del Sol (España)',
    detectedZone: 'Península Ibérica y Mediterráneo Europeo',
    country: 'España',
    coords: [40.4168, -3.7038],
    aliases: ['madrid', 'barcelona', 'ibiza', 'mallorca', 'costa del sol', 'sevilla', 'valencia', 'espana', 'españa'],
    popular: true,
    tag: 'Cultura, Tapas & Mediterráneo'
  },
  {
    id: 'roma_italia',
    name: 'Roma / Costa Amalfitana (Italia)',
    detectedZone: 'Península Itálica y Mediterráneo Central',
    country: 'Italia',
    coords: [41.9028, 12.4964],
    aliases: ['roma', 'italia', 'florencia', 'venecia', 'costa amalfitana', 'milan', 'milán', 'sicilia'],
    popular: true,
    tag: 'Historia Clásica & Arte'
  },
  {
    id: 'paris',
    name: 'París (Francia)',
    detectedZone: 'Europa Occidental Continental',
    country: 'Francia',
    coords: [48.8566, 2.3522],
    aliases: ['paris', 'parís', 'francia', 'costa azul', 'niza'],
    popular: true,
    tag: 'Ciudad Luz, Museos & Romance'
  },

  // ==========================================
  // ÁFRICA
  // ==========================================
  {
    id: 'cape_town',
    name: 'Ciudad del Cabo / Safari Kruger (Sudáfrica)',
    detectedZone: 'África Austral',
    country: 'Sudáfrica',
    coords: [-33.9249, 18.4241],
    aliases: ['ciudad del cabo', 'cape town', 'johannesburgo', 'sudafrica', 'sudáfrica', 'kruger', 'cataratas victoria'],
    popular: true,
    tag: 'Safaris & Rutas Escénicas'
  },
  {
    id: 'zanzibar_kenya',
    name: 'Zanzíbar / Serengeti (Tanzania & Kenia)',
    detectedZone: 'África Oriental y Llanuras del Serengeti',
    country: 'Tanzania / Kenia',
    coords: [-6.1659, 39.2026],
    aliases: ['zanzibar', 'zanzíbar', 'kenia', 'kenya', 'nairobi', 'tanzania', 'serengeti', 'kilimanjaro'],
    popular: false,
    tag: 'Playas Índicas & Gran Migración'
  }
];
