// datos de cada país que vienen de la API
export interface Country {
  names?: {
    common: string;
    official: string;
  };
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
  }>;
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
}


// estructura de la respuesta con paginación de la API
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
