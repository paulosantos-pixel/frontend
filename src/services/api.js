const BASE_URL = import.meta.env.VITE_API_URL;

export async function getProductos({ page = 0, limit = 6, nombre = "" } = {}) {
  const params = new URLSearchParams({ skip: page * limit, limit });
  if (nombre) params.append("nombre", nombre);
  
  const res = await fetch(`${BASE_URL}/productos/?${params}`);
  if (!res.ok) throw new Error(`Error ${res.status} al pedir los productos`);
  
  return res.json();
}