import type { ApiResponse, Country } from '../types/country';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.restcountries.com/countries/v5';
const API_KEY = (import.meta.env.VITE_API_KEY || '').trim();

// peticion base a la api con manejo de errores de red y HTTP
async function fetchFromApi<T>(endpoint: string): Promise<T> {
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
    // Error de red (sin conexión a internet o fallo de DNS)
    throw new Error('Error de red');
  }

  // Error HTTP: el servidor respondió con un código fuera del rango 200-299
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  return response.json();
}





// trae países paginados (por defecto los primeros 10)
export async function getCountries(limit = 10, offset = 0): Promise<ApiResponse> {
  return fetchFromApi<ApiResponse>(`?limit=${limit}&offset=${offset}`);
}

// busca países aplicando filtros y paginación directa en la API
export async function searchCountries(params: {
  q?: string;
  region?: string;
  language?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> {
  const searchParams = new URLSearchParams();
  if (params.q) {
    const cleanQ = params.q.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    searchParams.set('q', cleanQ);
  }




  if (params.region) searchParams.set('region', params.region);
  if (params.language) searchParams.set('languages', params.language);
  searchParams.set('limit', String(params.limit ?? 12));
  searchParams.set('offset', String(params.offset ?? 0));
  searchParams.set('response_fields', 'names,codes,flag,flags,capitals,capital,region,population');

  return fetchFromApi<ApiResponse>(`?${searchParams.toString()}`);
}



// busca un país puntual por su código ISO (ej: "ARG") o por nombre común si no tiene código ISO (ej: "Abkhazia")
export async function getCountryByCode(code: string): Promise<Country> {
  const cleanCode = decodeURIComponent(code).trim();
  if (!cleanCode) throw new Error('Código no válido');

  // Si es un código ISO estándar de 2 o 3 letras
  if (/^[A-Za-z]{2,3}$/.test(cleanCode)) {
    try {
      const res = await fetchFromApi<{ data?: { objects?: Country[] } | Country }>(`/codes.alpha_3/${cleanCode.toUpperCase()}`);
      if (res && typeof res === 'object' && 'data' in res && res.data) {
        const objects = (res.data as { objects?: Country[] }).objects;
        if (Array.isArray(objects) && objects.length > 0) return objects[0];
      }
    } catch {
      // si no está por alpha_3, intentamos por alpha_2
      try {
        const res2 = await fetchFromApi<{ data?: { objects?: Country[] } | Country }>(`/codes.alpha_2/${cleanCode.toUpperCase()}`);
        if (res2 && typeof res2 === 'object' && 'data' in res2 && res2.data) {
          const objects = (res2.data as { objects?: Country[] }).objects;
          if (Array.isArray(objects) && objects.length > 0) return objects[0];
        }
      } catch {
        // pasamos al fallback por nombre
      }
    }
  }

  // Fallback por nombre común (para territorios especiales o no reconocidos oficialmente)
  const nameRes = await fetchFromApi<{ data?: { objects?: Country[] } | Country }>(`/names.common/${encodeURIComponent(cleanCode)}`);
  if (nameRes && typeof nameRes === 'object' && 'data' in nameRes && nameRes.data) {
    const objects = (nameRes.data as { objects?: Country[] }).objects;
    if (Array.isArray(objects) && objects.length > 0) return objects[0];
  }

  throw new Error(`No se pudo encontrar el país "${code}" en la API`);
}
