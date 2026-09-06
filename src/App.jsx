import ProductCard from './components/ProductCard'

function App() {
  return (
    <div className="min-h-screen bg-red-500">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Mi Tienda</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">🛒 Carrito (0)</span>
          </div>
        </div>
      </header>

      {/* Buscador */}
      <div className="container mx-auto p-4">
        <input 
          type="text" 
          placeholder="Buscar productos..." 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grilla de productos */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </div>
  )
}

export default App