export interface DestinationInfo {
  id: string;
  name: string; // "Cabo Frio", "Mar del Plata"
  detectedZone: string; // "Costa Argentina", "Região dos Lagos (Costa de Río de Janeiro)"
  country: string; // "Argentina", "Brasil"
  stateOrProvince?: string; // "Buenos Aires", "Rio de Janeiro"
  coords: [number, number]; // [lat, lng]
  aliases: string[]; // specific synonyms only
  popular: boolean;
  tag?: string; // e.g. "Playa", "Nieve / Montaña", "Selva", "Ciudad"
  neutralSeasonNoteDJF?: string;
  neutralSeasonNoteJJA?: string;
}

export const CURATED_DESTINATIONS: DestinationInfo[] = [
  // ==========================================
  // COSTA ARGENTINA (CADA LOCALIDAD INDIVIDUAL)
  // ==========================================
  {
    id: 'mar_del_plata',
    name: 'Mar del Plata',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-38.0055, -57.5426],
    aliases: ['mar del plata', 'mardel', 'la feliz', 'mdq'],
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
    aliases: ['pinamar'],
    popular: true,
    tag: 'Playa & Bosque'
  },
  {
    id: 'carilo',
    name: 'Cariló',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-37.1678, -56.8928],
    aliases: ['carilo', 'cariló', 'valeria del mar'],
    popular: true,
    tag: 'Bosque & Playa Exclusiva'
  },
  {
    id: 'villa_gesell',
    name: 'Villa Gesell',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-37.2639, -56.9731],
    aliases: ['villa gesell', 'gesell'],
    popular: true,
    tag: 'Playa & Médanos'
  },
  {
    id: 'mar_de_las_pampas',
    name: 'Mar de las Pampas',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-37.3325, -57.0261],
    aliases: ['mar de las pampas', 'las gaviotas', 'mar azul'],
    popular: true,
    tag: 'Bosque & Mar'
  },
  {
    id: 'san_bernardo',
    name: 'San Bernardo',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-36.6872, -56.6908],
    aliases: ['san bernardo', 'la costa san bernardo'],
    popular: true,
    tag: 'Playa'
  },
  {
    id: 'san_clemente',
    name: 'San Clemente del Tuyú',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-36.3569, -56.7235],
    aliases: ['san clemente', 'san clemente del tuyu', 'san clemente del tuyú', 'punta rasa'],
    popular: true,
    tag: 'Playa & Termas Marinas'
  },
  {
    id: 'santa_teresita',
    name: 'Santa Teresita / Mar del Tuyú',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-36.5414, -56.6908],
    aliases: ['santa teresita', 'mar del tuyu', 'mar del tuyú', 'costa del este'],
    popular: false,
    tag: 'Playa'
  },
  {
    id: 'miramar',
    name: 'Miramar',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-38.2731, -57.8344],
    aliases: ['miramar', 'mar del sur'],
    popular: false,
    tag: 'Playa Familiar'
  },
  {
    id: 'necochea',
    name: 'Necochea / Quequén',
    detectedZone: 'Costa Argentina (Costa Atlántica Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-38.5545, -58.7396],
    aliases: ['necochea', 'quequen', 'quequén'],
    popular: false,
    tag: 'Playas Amplias & Surf'
  },
  {
    id: 'claromeco',
    name: 'Claromecó',
    detectedZone: 'Costa Argentina (Costa Atlántica Sur Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-38.8558, -60.0767],
    aliases: ['claromeco', 'claromecó', 'tres arroyos'],
    popular: false,
    tag: 'Playa & Faro'
  },
  {
    id: 'monte_hermoso',
    name: 'Monte Hermoso',
    detectedZone: 'Costa Argentina (Costa Atlántica Sur Bonaerense)',
    country: 'Argentina',
    stateOrProvince: 'Buenos Aires',
    coords: [-38.9833, -61.2833],
    aliases: ['monte hermoso', 'pehuen co', 'pehuén có'],
    popular: false,
    tag: 'Playa de Aguas Cálidas'
  },
  {
    id: 'buenos_aires',
    name: 'Buenos Aires (CABA / AMBA)',
    detectedZone: 'Río de la Plata y Región Metropolitana',
    country: 'Argentina',
    stateOrProvince: 'Ciudad Autónoma de Buenos Aires',
    coords: [-34.6037, -58.3816],
    aliases: ['buenos aires', 'caba', 'capital federal', 'tigre', 'san isidro', 'la plata'],
    popular: true,
    tag: 'Metrópolis Urbana & Cultura'
  },

  // ==========================================
  // BRASIL - REGIÃO DOS LAGOS & RÍO DE JANEIRO (LOCALIDADES INDIVIDUALES)
  // ==========================================
  {
    id: 'cabo_frio',
    name: 'Cabo Frio',
    detectedZone: 'Região dos Lagos (Costa de Río de Janeiro, Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Rio de Janeiro',
    coords: [-22.8808, -42.0184],
    aliases: ['cabo frio', 'praia do forte cabo frio', 'peroo'],
    popular: true,
    tag: 'Playas de Arena Blanca & Dunas'
  },
  {
    id: 'buzios',
    name: 'Búzios (Armação dos Búzios)',
    detectedZone: 'Região dos Lagos (Costa de Río de Janeiro, Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Rio de Janeiro',
    coords: [-22.7469, -41.8817],
    aliases: ['buzios', 'búzios', 'armacao dos buzios', 'armação dos búzios', 'geriba', 'joao fernandes'],
    popular: true,
    tag: 'Playas Exclusivas & Gastronomía'
  },
  {
    id: 'arraial_do_cabo',
    name: 'Arraial do Cabo',
    detectedZone: 'Região dos Lagos (Costa de Río de Janeiro, Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Rio de Janeiro',
    coords: [-22.9661, -42.0278],
    aliases: ['arraial do cabo', 'arraial', 'el caribe brasilero', 'praia do farol'],
    popular: true,
    tag: 'Buceo & Aguas Turquesas'
  },
  {
    id: 'rio_de_janeiro',
    name: 'Río de Janeiro',
    detectedZone: 'Sudeste de Brasil (Costa Carioca)',
    country: 'Brasil',
    stateOrProvince: 'Rio de Janeiro',
    coords: [-22.9068, -43.1729],
    aliases: ['rio de janeiro', 'río de janeiro', 'rio', 'copacabana', 'ipanema', 'leblon', 'barra da tijuca'],
    popular: true,
    tag: 'Playas Icónicas & Fiesta'
  },
  {
    id: 'angra_dos_reis',
    name: 'Angra dos Reis / Ilha Grande',
    detectedZone: 'Costa Verde (Litoral de Río de Janeiro, Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Rio de Janeiro',
    coords: [-23.0067, -44.3181],
    aliases: ['angra dos reis', 'angra', 'ilha grande', 'abraao'],
    popular: false,
    tag: 'Islas, Vela & Selva'
  },
  {
    id: 'paraty',
    name: 'Paraty',
    detectedZone: 'Costa Verde (Litoral de Río de Janeiro, Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Rio de Janeiro',
    coords: [-23.2178, -44.7131],
    aliases: ['paraty', 'parati'],
    popular: false,
    tag: 'Ciudad Colonial & Playas'
  },

  // ==========================================
  // BRASIL - SANTA CATARINA & SUR (LOCALIDADES INDIVIDUALES)
  // ==========================================
  {
    id: 'florianopolis',
    name: 'Florianópolis (Floripa)',
    detectedZone: 'Sur de Brasil (Costa de Santa Catarina)',
    country: 'Brasil',
    stateOrProvince: 'Santa Catarina',
    coords: [-27.5954, -48.5480],
    aliases: ['florianopolis', 'florianópolis', 'floripa', 'canasvieiras', 'ingleses', 'jurere'],
    popular: true,
    tag: 'Playas, Surf & Vida Nocturna'
  },
  {
    id: 'balneario_camboriu',
    name: 'Balneário Camboriú',
    detectedZone: 'Sur de Brasil (Costa de Santa Catarina)',
    country: 'Brasil',
    stateOrProvince: 'Santa Catarina',
    coords: [-26.9926, -48.6352],
    aliases: ['camboriu', 'camboriú', 'balneario camboriu', 'balneário camboriú'],
    popular: true,
    tag: 'Rascacielos, Playa & Vida Nocturna'
  },
  {
    id: 'bombinhas',
    name: 'Bombinhas',
    detectedZone: 'Sur de Brasil (Costa de Santa Catarina)',
    country: 'Brasil',
    stateOrProvince: 'Santa Catarina',
    coords: [-27.1408, -48.5147],
    aliases: ['bombinhas', 'mariscal', 'quatro ilhas', 'bombas'],
    popular: true,
    tag: 'Playas Cristalinas & Snorkel'
  },
  {
    id: 'garopaba',
    name: 'Garopaba',
    detectedZone: 'Sur de Brasil (Costa de Santa Catarina)',
    country: 'Brasil',
    stateOrProvince: 'Santa Catarina',
    coords: [-28.0261, -48.6186],
    aliases: ['garopaba', 'siriu', 'ferrugem'],
    popular: true,
    tag: 'Surf & Naturaleza'
  },
  {
    id: 'praia_do_rosa',
    name: 'Praia do Rosa',
    detectedZone: 'Sur de Brasil (Costa de Santa Catarina)',
    country: 'Brasil',
    stateOrProvince: 'Santa Catarina',
    coords: [-28.1283, -48.6508],
    aliases: ['praia do rosa', 'rosa', 'imbituba'],
    popular: true,
    tag: 'Playas Vírgenes & Ballenas'
  },
  {
    id: 'itapema',
    name: 'Itapema / Porto Belo',
    detectedZone: 'Sur de Brasil (Costa de Santa Catarina)',
    country: 'Brasil',
    stateOrProvince: 'Santa Catarina',
    coords: [-27.0911, -48.6108],
    aliases: ['itapema', 'meia praia', 'porto belo'],
    popular: false,
    tag: 'Playa & Náutica'
  },

  // ==========================================
  // BRASIL - BAHÍA & NORDESTE
  // ==========================================
  {
    id: 'salvador_bahia',
    name: 'Salvador de Bahía',
    detectedZone: 'Nordeste de Brasil (Litoral de Bahía)',
    country: 'Brasil',
    stateOrProvince: 'Bahia',
    coords: [-12.9777, -38.5016],
    aliases: ['salvador de bahia', 'salvador', 'bahia', 'bahía', 'pelourinho'],
    popular: true,
    tag: 'Cultura Afro-Brasileña & Playa'
  },
  {
    id: 'porto_seguro',
    name: 'Porto Seguro',
    detectedZone: 'Costa del Descubrimiento (Sur de Bahía, Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Bahia',
    coords: [-16.4498, -39.0647],
    aliases: ['porto seguro', 'arraial dajuda', 'arraial d ayuda'],
    popular: true,
    tag: 'Playas, Fiestas & Axé'
  },
  {
    id: 'trancoso',
    name: 'Trancoso',
    detectedZone: 'Costa del Descubrimiento (Sur de Bahía, Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Bahia',
    coords: [-16.5911, -39.0942],
    aliases: ['trancoso', 'quadrado'],
    popular: false,
    tag: 'Playa Bohemia Exclusiva'
  },
  {
    id: 'morro_de_sao_paulo',
    name: 'Morro de São Paulo',
    detectedZone: 'Costa do Dendê (Bahía, Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Bahia',
    coords: [-13.3808, -38.9158],
    aliases: ['morro de sao paulo', 'morro de são paulo', 'morro'],
    popular: true,
    tag: 'Isla Peatonal & Playas'
  },
  {
    id: 'fortaleza',
    name: 'Fortaleza',
    detectedZone: 'Norte y Nordeste Septentrional de Brasil',
    country: 'Brasil',
    stateOrProvince: 'Ceará',
    coords: [-3.7319, -38.5267],
    aliases: ['fortaleza', 'ceara', 'ceará'],
    popular: true,
    tag: 'Metrópolis Costera & Playa'
  },
  {
    id: 'jericoacoara',
    name: 'Jericoacoara (Jeri)',
    detectedZone: 'Costa de Ceará (Norte de Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Ceará',
    coords: [-2.7958, -40.5139],
    aliases: ['jericoacoara', 'jeri'],
    popular: true,
    tag: 'Dunas, Lagunas & Kitesurf'
  },
  {
    id: 'natal',
    name: 'Natal / Pipa',
    detectedZone: 'Nordeste Oriental de Brasil (Rio Grande do Norte)',
    country: 'Brasil',
    stateOrProvince: 'Rio Grande do Norte',
    coords: [-5.7945, -35.2110],
    aliases: ['natal', 'pipa', 'praia da pipa', 'tibau do sul'],
    popular: true,
    tag: 'Dunas & Delfines'
  },
  {
    id: 'porto_de_galinhas',
    name: 'Porto de Galinhas / Recife',
    detectedZone: 'Nordeste Oriental de Brasil (Pernambuco)',
    country: 'Brasil',
    stateOrProvince: 'Pernambuco',
    coords: [-8.5042, -35.0069],
    aliases: ['porto de galinhas', 'recife', 'muro alto', 'maracaipe'],
    popular: true,
    tag: 'Piscinas Naturales & Corales'
  },
  {
    id: 'maceio',
    name: 'Maceió / Maragogi',
    detectedZone: 'Costa dos Corais (Alagoas, Brasil)',
    country: 'Brasil',
    stateOrProvince: 'Alagoas',
    coords: [-9.6658, -35.7351],
    aliases: ['maceio', 'maceió', 'maragogi', 'sao miguel dos milagres'],
    popular: true,
    tag: 'Aguas Esmeralda & Barrera de Coral'
  },

  // ==========================================
  // URUGUAY (LOCALIDADES INDIVIDUALES)
  // ==========================================
  {
    id: 'punta_del_este',
    name: 'Punta del Este',
    detectedZone: 'Costa de Maldonado (Atlántico Uruguayo)',
    country: 'Uruguay',
    stateOrProvince: 'Maldonado',
    coords: [-34.9667, -54.9500],
    aliases: ['punta del este', 'punta', 'la barra'],
    popular: true,
    tag: 'Playa Exclusiva & Gastronomía'
  },
  {
    id: 'jose_ignacio',
    name: 'José Ignacio',
    detectedZone: 'Costa Atlántica de Maldonado (Uruguay)',
    country: 'Uruguay',
    stateOrProvince: 'Maldonado',
    coords: [-34.8519, -54.6331],
    aliases: ['jose ignacio', 'josé ignacio'],
    popular: false,
    tag: 'Playa Chic & Faro'
  },
  {
    id: 'la_paloma_rocha',
    name: 'La Paloma / Cabo Polonio (Rocha)',
    detectedZone: 'Costa Oceánica de Rocha (Uruguay)',
    country: 'Uruguay',
    stateOrProvince: 'Rocha',
    coords: [-34.6667, -54.1667],
    aliases: ['la paloma', 'cabo polonio', 'punta del diablo', 'rocha', 'la pedrera'],
    popular: true,
    tag: 'Playas Oceánicas & Ecoturismo'
  },
  {
    id: 'montevideo',
    name: 'Montevideo',
    detectedZone: 'Costa de Uruguay y Río de la Plata',
    country: 'Uruguay',
    stateOrProvince: 'Montevideo',
    coords: [-34.9011, -56.1645],
    aliases: ['montevideo', 'rambla de montevideo'],
    popular: false,
    tag: 'Rambla, Historia & Cultura'
  },
  {
    id: 'colonia',
    name: 'Colonia del Sacramento',
    detectedZone: 'Riberas del Río de la Plata (Uruguay)',
    country: 'Uruguay',
    stateOrProvince: 'Colonia',
    coords: [-34.4714, -57.8442],
    aliases: ['colonia', 'colonia del sacramento'],
    popular: false,
    tag: 'Casco Histórico Colonial'
  },

  // ==========================================
  // PATAGONIA & CUYO ARGENTINA (LOCALIDADES INDIVIDUALES)
  // ==========================================
  {
    id: 'bariloche',
    name: 'Bariloche (San Carlos de Bariloche)',
    detectedZone: 'Patagonia Andina y Región de los Lagos',
    country: 'Argentina',
    stateOrProvince: 'Río Negro',
    coords: [-41.1335, -71.3103],
    aliases: ['bariloche', 'san carlos de bariloche', 'cerro catedral'],
    popular: true,
    tag: 'Montaña, Nieve & Lagos',
    neutralSeasonNoteDJF: 'En verano (Diciembre-Febrero), la Patagonia Andina goza de su mejor época: días largos, soleados, muy baja humedad y vientos moderados del oeste. Espléndido para trekking, navegación lacustre y playas de lago.',
    neutralSeasonNoteJJA: 'En invierno (Junio-Agosto), predominan los sistemas frontales polares antárticos con bajas temperaturas y nevadas frecuentes en Cerro Catedral y cerros andinos, ideales para esquí y turismo invernal.'
  },
  {
    id: 'villa_la_angostura',
    name: 'Villa La Angostura',
    detectedZone: 'Patagonia Andina (Parque Nacional Nahuel Huapi)',
    country: 'Argentina',
    stateOrProvince: 'Neuquén',
    coords: [-40.7614, -71.6444],
    aliases: ['villa la angostura', 'angostura', 'cerro bayo'],
    popular: true,
    tag: 'Lagos & Bosque de Arrayanes'
  },
  {
    id: 'san_martin_de_los_andes',
    name: 'San Martín de los Andes',
    detectedZone: 'Patagonia Andina (Parque Nacional Lanín)',
    country: 'Argentina',
    stateOrProvince: 'Neuquén',
    coords: [-40.1583, -71.3533],
    aliases: ['san martin de los andes', 'san martín de los andes', 'cerro chapelco'],
    popular: true,
    tag: 'Lagos, Chapelco & 7 Lagos'
  },
  {
    id: 'el_bolson',
    name: 'El Bolsón',
    detectedZone: 'Comarca Andina del Paralelo 42 (Patagonia)',
    country: 'Argentina',
    stateOrProvince: 'Río Negro',
    coords: [-41.9667, -71.5333],
    aliases: ['el bolson', 'el bolsón', 'lago puelo'],
    popular: false,
    tag: 'Lúpulo, Montaña & Ferias'
  },
  {
    id: 'el_calafate',
    name: 'El Calafate',
    detectedZone: 'Patagonia Austral y Parque Nacional Los Glaciares',
    country: 'Argentina',
    stateOrProvince: 'Santa Cruz',
    coords: [-50.3378, -72.2648],
    aliases: ['el calafate', 'calafate', 'glaciar perito moreno'],
    popular: true,
    tag: 'Glaciares & Navegación',
    neutralSeasonNoteDJF: 'Temporada alta de trekking. Mucha luz diurna (hasta las 22 hs), vientos patagónicos intensos y temperaturas templadas de día (15-20°C). Se rige por los vientos del oeste y el campo de hielo.',
    neutralSeasonNoteJJA: 'Invierno patagónico: muy frío, días cortos, heladas y nieve en estepa. Servicios reducidos pero paisajes vírgenes congelados.'
  },
  {
    id: 'el_chalten',
    name: 'El Chaltén',
    detectedZone: 'Capital Nacional del Trekking (Patagonia)',
    country: 'Argentina',
    stateOrProvince: 'Santa Cruz',
    coords: [-49.3314, -72.8864],
    aliases: ['el chalten', 'el chaltén', 'fitz roy'],
    popular: true,
    tag: 'Trekking & Fitz Roy'
  },
  {
    id: 'ushuaia',
    name: 'Ushuaia',
    detectedZone: 'Tierra del Fuego y Canal Beagle',
    country: 'Argentina',
    stateOrProvince: 'Tierra del Fuego',
    coords: [-54.8019, -68.3030],
    aliases: ['ushuaia', 'fin del mundo', 'cerro castor'],
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
    aliases: ['mendoza', 'valle de uco', 'san rafael', 'cuyo'],
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
    aliases: ['villa carlos paz', 'carlos paz', 'cordoba', 'córdoba', 'villa general belgrano', 'la cumbrecita', 'mina clavero', 'calamuchita', 'traslasierra'],
    popular: true,
    tag: 'Sierras, Ríos & Festivales',
    neutralSeasonNoteDJF: 'Verano serrano clásico: calor diurno, balnearios de río colmados y episodios de tormentas orográficas que provocan repentinas crecidas en ríos serranos.',
    neutralSeasonNoteJJA: 'Invierno seco, cielo azul diáfano, días templados al sol y noches frías con heladas ocasionales.'
  },
  {
    id: 'iguazu',
    name: 'Cataratas del Iguazú / Puerto Iguazú',
    detectedZone: 'Litoral y Selva Misionera (Cuenca del Plata)',
    country: 'Argentina',
    stateOrProvince: 'Misiones',
    coords: [-25.5976, -54.5779],
    aliases: ['iguazu', 'iguazú', 'cataratas', 'puerto iguazu'],
    popular: true,
    tag: 'Naturaleza & Maravilla del Mundo'
  },

  // ==========================================
  // CARIBE, CENTROAMÉRICA & NORTEAMÉRICA
  // ==========================================
  {
    id: 'cancun',
    name: 'Cancún / Riviera Maya',
    detectedZone: 'Caribe Mexicano (Península de Yucatán)',
    country: 'México',
    stateOrProvince: 'Quintana Roo',
    coords: [21.1619, -86.8515],
    aliases: ['cancun', 'cancún', 'playa del carmen', 'tulum', 'riviera maya', 'cozumel'],
    popular: true,
    tag: 'Playas Turquesa, Cenotes & Ruinas'
  },
  {
    id: 'punta_cana',
    name: 'Punta Cana',
    detectedZone: 'República Dominicana (Caribe Insular)',
    country: 'República Dominicana',
    coords: [18.5601, -68.3725],
    aliases: ['punta cana', 'bavaro', 'bayahibe'],
    popular: true,
    tag: 'All Inclusive & Playas de Palma'
  },
  {
    id: 'miami',
    name: 'Miami / Orlando (Florida)',
    detectedZone: 'Península de Florida (Sur de EE. UU.)',
    country: 'Estados Unidos',
    stateOrProvince: 'Florida',
    coords: [25.7617, -80.1918],
    aliases: ['miami', 'orlando', 'florida', 'fort lauderdale'],
    popular: true,
    tag: 'Parques Temáticos & Playas'
  },
  {
    id: 'bali',
    name: 'Bali',
    detectedZone: 'Archipiélago de Indonesia y Sonda',
    country: 'Indonesia',
    coords: [-8.3405, 115.0920],
    aliases: ['bali', 'ubud', 'seminyak', 'canggu'],
    popular: true,
    tag: 'Templos, Arrozales & Playas'
  }
];
