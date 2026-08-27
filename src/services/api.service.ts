import type { ApiResponse, Country } from '../types/country';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.restcountries.com/countries/v5';
const API_KEY = import.meta.env.VITE_API_KEY || 'rc_live_c29bbea559e244bb9b65536638be4af2';


// función genérica para pegarle a la api con el token
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  // agregamos el token tanto por query param como por header para evitar problemas de CORS en navegador
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${API_URL}${endpoint}${separator}api-key=${API_KEY}`;
  
  console.log('Consultando API:', url);

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

// busca países por nombre
export async function searchCountriesByName(query: string, limit = 10, offset = 0): Promise<ApiResponse> {
  return fetchFromApi<ApiResponse>(`?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
}

// busca un país puntual por su código de 3 letras (ej: "ARG")
export async function getCountryByCode(code: string): Promise<Country> {
  const res = await fetchFromApi<{ data: Country }>(`/codes.alpha_3/${code.toUpperCase()}`);
  return res.data;
}
