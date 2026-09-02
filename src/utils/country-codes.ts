// traductores nativos de JavaScript (Intl API)
const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
const languageNames = new Intl.DisplayNames(['es'], { type: 'language' });
const currencyNames = new Intl.DisplayNames(['es'], { type: 'currency' });

// mapeo completo de codigos de 3 letras a 2 letras para que Intl traduzca todas las fronteras del mundo
const ISO3_TO_ISO2: Record<string, string> = {
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


// traduce un codigo ISO de pais (ej: BRA -> Brasil)
export function getCountryNameFromCode(code: string): string {
  if (!code) return '';
  const clean = code.trim().toUpperCase();
  const alpha2 = clean.length === 3 ? (ISO3_TO_ISO2[clean] || clean.slice(0, 2)) : clean;
  try {
    return regionNames.of(alpha2) || clean;
  } catch {
    return clean;
  }
}

// traduce el idioma a español (ej: "es" -> "Español")
export function formatLanguageName(lang: any): string {
  if (!lang) return '';
  const code = typeof lang === 'string' ? lang : (lang.iso639_1 || lang.name || '');
  try {
    const translated = languageNames.of(code.toLowerCase());
    return translated ? translated.charAt(0).toUpperCase() + translated.slice(1) : (lang.name || code);
  } catch {
    return lang.name || code;
  }
}

// traduce la moneda a español (ej: ARS -> Peso argentino ($)
export function formatCurrencyName(curr: any): string {
  if (!curr) return '';
  const code = (typeof curr === 'string' ? curr : curr.code || '').trim().toUpperCase();
  const symbol = curr.symbol ? ` (${curr.symbol})` : '';
  try {
    const translated = currencyNames.of(code);
    return translated ? `${translated.charAt(0).toUpperCase() + translated.slice(1)}${symbol}` : `${code}${symbol}`;
  } catch {
    return `${curr.name || code}${symbol}`;
  }
}

// traducciones de continentes a español
const REGIONS: Record<string, string> = {
  americas: 'América',
  europe: 'Europa',
  asia: 'Asia',
  africa: 'África',
  oceania: 'Oceanía',
  antarctic: 'Antártida',
  antarctica: 'Antártida'
};

export function formatRegionName(region: string): string {
  return REGIONS[region?.trim().toLowerCase()] || region || 'Desconocida';
}

// traducciones de subregiones a español
const SUBREGIONS: Record<string, string> = {
  'middle africa': 'África Central',
  'western africa': 'África Occidental',
  'eastern africa': 'África Oriental',
  'northern africa': 'África del Norte',
  'southern africa': 'África Austral',
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
  'polynesia': 'Polinesia',
  'melanesia': 'Melanesia',
  'micronesia': 'Micronesia',
  'australia and new zealand': 'Australia y Nueva Zelanda'
};

export function formatSubregionName(subregion: string): string {
  if (!subregion) return '';
  const key = subregion.trim().toLowerCase();
  return SUBREGIONS[key] || subregion;
}
