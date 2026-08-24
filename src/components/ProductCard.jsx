export default function ProductCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <img 
        src="https://via.placeholder.com/300x200" 
        alt="Producto" 
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="text-lg font-bold mt-2">Nombre del producto</h3>
      <p className="text-gray-600">$10.000</p>
      <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
        Agregar al carrito
      </button>
    </div>
  )
}