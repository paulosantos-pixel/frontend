const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function getProductos() {
  try {
    const response = await fetch(`${API_BASE_URL}/productos`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}