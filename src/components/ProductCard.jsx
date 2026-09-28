import { useCarrito } from "../context/CarritoContext";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ESin imagen%3C/text%3E%3C/svg%3E";

export default function ProductCard({
  id,
  nombre = "Producto sin nombre",
  precio_final = 0,
  imagen_url = PLACEHOLDER,
  descripcion = "Sin descripcion",
  cuotas_cantidad = 0,
  cuotas_valor = 0,
  garantia_meses = 0,
}) {
  const { agregar } = useCarrito();
  const precioFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", minimumFractionDigits: 0,
  }).format(precio_final);
  const cuotaFormateada = new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", minimumFractionDigits: 0,
  }).format(cuotas_valor);

  function handleAgregar() {
    agregar({ id, nombre, precio_final, imagen_url });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col">
      <img
        src={imagen_url || PLACEHOLDER}
        alt={nombre}
        className="w-full h-48 object-cover rounded-md bg-gray-100"
        onError={(e) => { e.target.src = PLACEHOLDER; }}
      />
      <h3 className="text-lg font-bold mt-2 truncate">{nombre}</h3>
      <p className="text-gray-600 text-sm line-clamp-2 flex-grow">{descripcion}</p>
      <p className="text-xl font-bold text-green-600 mt-2">{precioFormateado}</p>
      {cuotas_cantidad > 0 && cuotas_valor > 0 && (
        <p className="text-sm text-gray-700">{cuotas_cantidad}x {cuotaFormateada} sin interes</p>
      )}
      {garantia_meses > 0 && (
        <p className="text-xs text-gray-500 mt-1">Garantia: {garantia_meses} meses</p>
      )}
      <button
        onClick={handleAgregar}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Agregar al carrito
      </button>
    </div>
  );
}