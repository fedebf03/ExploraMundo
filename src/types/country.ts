export interface Country {

  names?: {
    common: string;
    official: string;
    translations?: Record<string, { common: string; official: string }>;
  };
  translations?: Record<string, { common: string; official: string }>;
  name?: {
    common: string;
    official: string;
  };

  codes?: {
    alpha_2?: string;
    alpha_3?: string;
  };
  cca3?: string;
  capitals?: Array<{
    name: string;
    primary?: boolean;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  }>;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  capital?: string[];

  region?: string;
  subregion?: string;
  population?: number;
  flag?: {
    emoji?: string;
    url_png?: string;
    url_svg?: string;
  };
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  languages?: Array<{
    name?: string;
    native_name?: string;
    iso639_1?: string;
    iso639_2b?: string;
    iso639_3?: string;
    bcp47?: string;
  }> | Record<string, string>;
  currencies?: Array<{
    name?: string;
    code?: string;
    symbol?: string;
  }>;
  borders?: string[];
  area?: {
    kilometers?: number;
    miles?: number;
  } | number;
  landlocked?: boolean;
  economy?: {
    gini_coefficient?: Record<string, number>;
  };
  cars?: {
    driving_side?: 'right' | 'left' | string;
    signs?: string[];
  };
  links?: {
    official?: string;
    wikipedia?: string;
    google_maps?: string;
    open_street_maps?: string;
  };
}




export interface ApiResponse {

  data: {
    meta: {
      limit: number;
      offset: number;
      total: number;
      count: number;
    };
    objects: Country[];
  };
}
