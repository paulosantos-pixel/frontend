const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function getProductos({ page = 0, limit = 6, nombre = "" } = {}) {
  try {
    const params = new URLSearchParams({ skip: page * limit, limit });
    if (nombre) params.append("nombre", nombre);
    
    const response = await fetch(`${API_BASE_URL}/productos?${params}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}