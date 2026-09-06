export default function ProductCard({ 
  nombre = "Producto sin nombre", 
  precio = 0, 
  imagen_url = "https://via.placeholder.com/300x200",
  descripcion = "Sin descripción"
}) {
  const precioFormateado = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(precio);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <img 
        src={imagen_url} 
        alt={nombre} 
        className="w-full h-48 object-cover rounded-md"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200";
        }}
      />
      <h3 className="text-lg font-bold mt-2 truncate">{nombre}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{descripcion}</p>
      <p className="text-xl font-bold text-green-600 mt-1">{precioFormateado}</p>
      <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
        Agregar al carrito
      </button>
    </div>
  );
}