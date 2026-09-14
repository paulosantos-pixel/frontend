import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { getProductos } from './services/api';

function App() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        setError('No pudimos cargar los productos. Verificá que el backend esté corriendo.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    cargarProductos();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">🔄 Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <p className="font-bold">❌ Error</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Recordá ejecutar: <code className="bg-red-200 px-2 py-1 rounded">python -m uvicorn app.main:app --reload</code></p>
        </div>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">📦 Todavía no hay productos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FrutiMix 🍊</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">🛒 Carrito (0)</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <input 
          type="text" 
          placeholder="Buscar productos..." 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard 
              key={producto.id}
              nombre={producto.nombre}
              precio_final={producto.precio_final}
              imagen_url={producto.imagen_url}
              descripcion={producto.descripcion}
              cuotas_cantidad={producto.cuotas_cantidad}
              cuotas_valor={producto.cuotas_valor}
              garantia_meses={producto.garantia_meses}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;