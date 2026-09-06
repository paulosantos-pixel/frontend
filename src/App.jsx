import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { getProductos } from './services/api';

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        const data = await getProductos();
        setProductos(data);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar los productos. Verificá que el backend esté corriendo.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

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
        {cargando && (
          <div className="text-center py-10">
            <p className="text-gray-500">Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <p className="text-sm mt-1">Recordá ejecutar: <code className="bg-red-200 px-2 py-1 rounded">python -m uvicorn app.main:app --reload</code></p>
          </div>
        )}

        {!cargando && !error && productos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No hay productos disponibles.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard 
              key={producto.id}
              nombre={producto.nombre}
              precio={producto.precio}
              imagen_url={producto.imagen_url}
              descripcion={producto.descripcion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;