export function urlImagen(producto) {
  if (!producto || !producto.imagen_url) return null;
  // Si la imagen ya es un link de internet, la usamos directo
  if (producto.imagen_url.startsWith("http")) return producto.imagen_url;
  // Si es una ruta local (/demo/...), le pegamos la URL del backend
  return `${import.meta.env.VITE_API_URL}${producto.imagen_url}`;
}