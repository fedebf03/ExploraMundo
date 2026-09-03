// continentes en español
const REGIONES: Record<string, string> = {
  Americas: 'América',
  Europe: 'Europa',
  Asia: 'Asia',
  Africa: 'África',
  Oceania: 'Oceanía',
  Antarctic: 'Antártida',
};

export function formatRegionName(region: string): string {
  return REGIONES[region] || region || 'Desconocida';
}

export function formatSubregionName(subregion: string): string {
  return subregion || 'No disponible';
}

// traductor nativo de JavaScript
const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });

// mapeo de codigos de 3 a 2 letras para que Intl traduzca las fronteras
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

export function getCountryNameFromCode(code: string): string {
  if (!code) return '';
  const clean = code.trim().toUpperCase();
  const alpha2 = ISO3_TO_ISO2[clean];
  if (alpha2) {
    try {
      return regionNames.of(alpha2) || clean;
    } catch {
      return clean;
    }
  }
  return clean;
}


// traductores nativos de idioma y moneda
const languageNames = new Intl.DisplayNames(['es'], { type: 'language' });
const currencyNames = new Intl.DisplayNames(['es'], { type: 'currency' });

export function formatLanguageName(lang: any): string {
  if (!lang) return '';
  const code = typeof lang === 'string' ? lang : (lang.iso639_1 || lang.bcp47 || '');
  if (code) {
    try {
      const translated = languageNames.of(code.toLowerCase());
      if (translated) {
        return translated.charAt(0).toUpperCase() + translated.slice(1);
      }
    } catch {}
  }
  return lang.name || '';
}

export function formatCurrencyName(curr: any): string {
  if (!curr) return '';
  const code = (typeof curr === 'string' ? curr : (curr.code || '')).trim().toUpperCase();
  const symbol = curr.symbol ? ` (${curr.symbol})` : '';
  if (code) {
    try {
      const translated = currencyNames.of(code);
      if (translated) {
        return `${translated.charAt(0).toUpperCase() + translated.slice(1)}${symbol}`;
      }
    } catch {}
  }
  return `${curr.name || code}${symbol}`;
}


