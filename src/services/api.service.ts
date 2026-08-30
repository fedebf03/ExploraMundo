import type { ApiResponse, Country } from '../types/country';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.restcountries.com/countries/v5';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// función genérica para pegarle a la api con el token
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${API_URL}${endpoint}${separator}api-key=${API_KEY}`;


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


// busca un país puntual por su código de 3 letras (ej: "ARG")
export async function getCountryByCode(code: string): Promise<Country> {
  const res = await fetchFromApi<{ data?: { objects?: Country[] } | Country }>(`/codes.alpha_3/${code.toUpperCase()}`);

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    const data = res.data as { objects?: Country[] } | Country;

    if (data && typeof data === 'object' && 'objects' in data && Array.isArray(data.objects) && data.objects.length > 0) {
      return data.objects[0];
    }

    if (data && typeof data === 'object') {
      return data as Country;
    }
  }

  throw new Error('No se encontró el país solicitado.');
}
