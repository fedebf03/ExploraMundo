// mapeo de codigos alpha-3 (3 letras) a alpha-2 (2 letras) para soporte estandar de Intl.DisplayNames
const ALPHA3_TO_ALPHA2: Record<string, string> = {
  AFG: 'AF', ALB: 'AL', DZA: 'DZ', AND: 'AD', AGO: 'AO', ARG: 'AR', ARM: 'AM', AUS: 'AU', AUT: 'AT', AZE: 'AZ',
  BHS: 'BS', BHR: 'BH', BGD: 'BD', BRB: 'BB', BLR: 'BY', BEL: 'BE', BLZ: 'BZ', BEN: 'BJ', BTN: 'BT', BOL: 'BO',
  BIH: 'BA', BWA: 'BW', BRA: 'BR', BRN: 'BN', BGR: 'BG', BFA: 'BF', BDI: 'BI', KHM: 'KH', CMR: 'CM', CAN: 'CA',
  CPV: 'CV', CAF: 'CF', TCD: 'TD', CHL: 'CL', CHN: 'CN', COL: 'CO', COM: 'KM', COG: 'CG', COD: 'CD', CRI: 'CR',
  CIV: 'CI', HRV: 'HR', CUB: 'CU', CYP: 'CY', CZE: 'CZ', DNK: 'DK', DJI: 'DJ', DMA: 'DM', DOM: 'DO', ECU: 'EC',
  EGY: 'EG', SLV: 'SV', GNQ: 'GQ', ERI: 'ER', EST: 'EE', ETH: 'ET', FJI: 'FJ', FIN: 'FI', FRA: 'FR', GAB: 'GA',
  GMB: 'GM', GEO: 'GE', DEU: 'DE', GHA: 'GH', GRC: 'GR', GRD: 'GD', GTM: 'GT', GIN: 'GN', GNB: 'GW', GUY: 'GY',
  HTI: 'HT', HND: 'HN', HUN: 'HU', ISL: 'IS', IND: 'IN', IDN: 'ID', IRN: 'IR', IRQ: 'IQ', IRL: 'IE', ISR: 'IL',
  ITA: 'IT', JAM: 'JM', JPN: 'JP', JOR: 'JO', KAZ: 'KZ', KEN: 'KE', KIR: 'KI', PRK: 'KP', KOR: 'KR', KWT: 'KW',
  KGZ: 'KG', LAO: 'LA', LVA: 'LV', LBN: 'LB', LSO: 'LS', LBR: 'LR', LBY: 'LY', LIE: 'LI', LTU: 'LT', LUX: 'LU',
  MDG: 'MG', MWI: 'MW', MYS: 'MY', MDV: 'MV', MLI: 'ML', MLT: 'MT', MHL: 'MH', MRT: 'MR', MUS: 'MU', MEX: 'MX',
  FSM: 'FM', MDA: 'MD', MCO: 'MC', MNG: 'MN', MNE: 'ME', MAR: 'MA', MOZ: 'MZ', MMR: 'MM', NAM: 'NA', NRU: 'NR',
  NPL: 'NP', NLD: 'NL', NZL: 'NZ', NIC: 'NI', NER: 'NE', NGA: 'NG', MKD: 'MK', NOR: 'NO', OMN: 'OM', PAK: 'PK',
  PLW: 'PW', PAN: 'PA', PNG: 'PG', PRY: 'PY', PER: 'PE', PHL: 'PH', POL: 'PL', PRT: 'PT', QAT: 'QA', ROU: 'RO',
  RUS: 'RU', RWA: 'RW', KNA: 'KN', LCA: 'LC', VCT: 'VC', WSM: 'WS', SMR: 'SM', STP: 'ST', SAU: 'SA', SEN: 'SN',
  SRB: 'RS', SYC: 'SC', SLE: 'SL', SGP: 'SG', SVK: 'SK', SVN: 'SI', SLB: 'SB', SOM: 'SO', ZAF: 'ZA', SSD: 'SS',
  ESP: 'ES', LKA: 'LK', SDN: 'SD', SUR: 'SR', SWE: 'SE', CHE: 'CH', SYR: 'SY', TWN: 'TW', TJK: 'TJ', TZA: 'TZ',
  THA: 'TH', TLS: 'TL', TGO: 'TG', TON: 'TO', TTO: 'TT', TUN: 'TN', TUR: 'TR', TKM: 'TM', TUV: 'TV', UGA: 'UG',
  UKR: 'UA', ARE: 'AE', GBR: 'GB', USA: 'US', URY: 'UY', UZB: 'UZ', VUT: 'VU', VEN: 'VE', VNM: 'VN', YEM: 'YE',
  ZMB: 'ZM', ZWE: 'ZW', PSE: 'PS', VAT: 'VA', XKX: 'XK'
};

const regionNames = typeof Intl !== 'undefined' && Intl.DisplayNames
  ? new Intl.DisplayNames(['es'], { type: 'region' })
  : null;

// convierte un codigo (ej: BGD o BD) al nombre del pais en español
const languageNames = typeof Intl !== 'undefined' && Intl.DisplayNames
  ? new Intl.DisplayNames(['es'], { type: 'language' })
  : null;

export function getCountryNameFromCode(code: string): string {
  if (!code) return '';
  const upperCode = code.trim().toUpperCase();

  // si es de 3 letras, buscamos su equivalente de 2 letras
  const alpha2 = upperCode.length === 3 ? ALPHA3_TO_ALPHA2[upperCode] : upperCode;

  if (alpha2 && regionNames) {
    try {
      const translated = regionNames.of(alpha2);
      if (translated) return translated;
    } catch {
      // fallback
    }
  }

  return upperCode;
}

// traduce un objeto de idioma o codigo a su nombre en espanol capitalizado (ej: sq -> Albanes)
export function formatLanguageName(lang: any): string {
  if (!lang) return '';
  if (typeof lang === 'string') {
    const code = lang.trim().toLowerCase();
    try {
      const translated = languageNames?.of(code);
      if (translated) return translated.charAt(0).toUpperCase() + translated.slice(1);
    } catch {
      return lang;
    }
  }

  const code = lang.iso639_1 || lang.bcp47 || lang.iso639_2b || lang.iso639_3;
  if (code && languageNames) {
    try {
      const translated = languageNames.of(code.toLowerCase());
      if (translated) return translated.charAt(0).toUpperCase() + translated.slice(1);
    } catch {
      // fallback
    }
  }

  const fallback = lang.name || lang.native_name || '';
  return fallback ? fallback.charAt(0).toUpperCase() + fallback.slice(1) : '';
}

const currencyNames = typeof Intl !== 'undefined' && Intl.DisplayNames
  ? new Intl.DisplayNames(['es'], { type: 'currency' })
  : null;

// traduce una moneda a su nombre en espanol (ej: ARS -> Peso argentino ($)
export function formatCurrencyName(curr: any): string {
  if (!curr) return '';
  const code = (typeof curr === 'string' ? curr : curr.code || '').trim().toUpperCase();
  const symbol = typeof curr === 'object' && curr.symbol ? ` (${curr.symbol})` : '';

  if (code && currencyNames) {
    try {
      const translated = currencyNames.of(code);
      if (translated) {
        return `${translated.charAt(0).toUpperCase() + translated.slice(1)}${symbol}`;
      }
    } catch {
      // fallback
    }
  }

  const fallbackName = typeof curr === 'object' && curr.name ? curr.name : code;
  return `${fallbackName}${symbol}`;
}

const REGION_MAP: Record<string, string> = {
  americas: 'América',
  europe: 'Europa',
  asia: 'Asia',
  africa: 'África',
  oceania: 'Oceanía',
  antarctic: 'Antártida',
  antarctica: 'Antártida'
};

const SUBREGION_MAP: Record<string, string> = {
  'south america': 'América del Sur',
  'north america': 'América del Norte',
  'central america': 'América Central',
  'caribbean': 'Caribe',
  'western europe': 'Europa Occidental',
  'eastern europe': 'Europa Oriental',
  'northern europe': 'Europa del Norte',
  'southern europe': 'Europa del Sur',
  'central europe': 'Europa Central',
  'southeast europe': 'Europa Sudoriental',
  'eastern asia': 'Asia Oriental',
  'southern asia': 'Asia del Sur',
  'south-eastern asia': 'Sudeste Asiático',
  'central asia': 'Asia Central',
  'western asia': 'Asia Occidental',
  'northern africa': 'África del Norte',
  'western africa': 'África Occidental',
  'eastern africa': 'África Oriental',
  'middle africa': 'África Central',
  'southern africa': 'África Austral',
  'polynesia': 'Polinesia',
  'melanesia': 'Melanesia',
  'micronesia': 'Micronesia',
  'australia and new zealand': 'Australia y Nueva Zelanda'
};

// traduce el continente a espanol (ej: Americas -> América)
export function formatRegionName(region: string): string {
  if (!region) return 'Desconocida';
  const key = region.trim().toLowerCase();
  return REGION_MAP[key] || region;
}

// traduce la subregion a espanol (ej: South America -> América del Sur)
export function formatSubregionName(subregion: string): string {
  if (!subregion) return '';
  const key = subregion.trim().toLowerCase();
  return SUBREGION_MAP[key] || subregion;
}



