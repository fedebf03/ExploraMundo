import type { ApiResponse, Country } from '../types/country';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.restcountries.com/countries/v5';
const API_KEY = (import.meta.env.VITE_API_KEY || '').trim();

async function fetchFromApi(endpoint: string): Promise<any> {
  const url = `${API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Accept': 'application/json'
  };

  if (API_KEY) {
    headers.Authorization = `Bearer ${API_KEY}`;
  }

  let response: Response;
  try {
    response = await fetch(url, { headers });
  } catch {
    throw new Error('Error de red');
  }

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  return response.json();
}

// trae países paginados (por defecto los primeros 10)
export async function getCountries(limit = 10, offset = 0): Promise<ApiResponse> {
  return fetchFromApi(`?limit=${limit}&offset=${offset}`);
}

// busca países aplicando filtros y paginación
export async function searchCountries(params: {
  texto?: string;
  region?: string;
  language?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> {
  const parametros = new URLSearchParams();

  if (params.texto) {
    const query = params.texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    parametros.set('q', query);
  }

  if (params.region) parametros.set('region', params.region);
  if (params.language) parametros.set('languages', params.language);
  parametros.set('limit', String(params.limit ?? 12));

  parametros.set('offset', String(params.offset ?? 0));
  parametros.set('response_fields', 'names,codes,flag,flags,capitals,capital,region,population');

  return fetchFromApi(`?${parametros.toString()}`);
}

// busca un país puntual por su código (ARG, AR o nombre)
export async function getCountryByCode(code: string): Promise<Country> {
  const codigo = code.trim().toUpperCase();
  if (!codigo) throw new Error('Código no válido');

  try {
    const respuesta = await fetchFromApi(`/codes.alpha_3/${codigo}`);
    if (respuesta.data?.objects?.[0]) return respuesta.data.objects[0];
  } catch {}

  try {
    const respuesta = await fetchFromApi(`/codes.alpha_2/${codigo}`);
    if (respuesta.data?.objects?.[0]) return respuesta.data.objects[0];
  } catch {}

  try {
    const respuesta = await fetchFromApi(`/names.common/${encodeURIComponent(code.trim())}`);
    if (respuesta.data?.objects?.[0]) return respuesta.data.objects[0];
  } catch {}


  throw new Error(`No se pudo encontrar el país "${code}" en la API`);
}

