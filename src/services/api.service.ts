import type { ApiResponse, Country } from '../types/country';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.restcountries.com/countries/v5';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// función genérica para pegarle a la API enviando el token por Header HTTP
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json'
    }
  });


  // si la respuesta no es 200/OK leemos el mensaje exacto que devuelve el servidor
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    console.error('Detalle del error de la API:', response.status, errorBody);
    throw new Error(`Error ${response.status} (${response.statusText}): ${errorBody || 'Acceso denegado'}`);
  }

  return response.json();
}



// trae países paginados (por defecto los primeros 10)
export async function getCountries(limit = 10, offset = 0): Promise<ApiResponse> {
  return fetchFromApi<ApiResponse>(`?limit=${limit}&offset=${offset}`);
}

// busca países con filtros y paginación directa en la API
export async function searchCountries(params: {
  q?: string;
  region?: string;
  membership?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set('q', params.q);
  if (params.region) searchParams.set('region', params.region);
  if (params.membership) searchParams.set(`memberships.${params.membership}`, '1');
  searchParams.set('limit', String(params.limit ?? 10));
  searchParams.set('offset', String(params.offset ?? 0));

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
