export function urlImagen(producto) {
  if (!producto || !producto.imagen_url) return null;
  const base = import.meta.env.VITE_API_URL || "";
  return `${base}${producto.imagen_url}`;
}