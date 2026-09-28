import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getProductos } from "../services/api";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductos({ page, nombre: busqueda });
        setProductos(data);
      } catch (err) {
        setError("No pudimos cargar los productos. Verifica que el backend este corriendo.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    cargarProductos();
  }, [page, busqueda]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => {
            setPage(0);
            setBusqueda(e.target.value);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {isLoading && (
        <div className="text-center py-10"><p className="text-gray-500">Cargando productos...</p></div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"><p>{error}</p></div>
      )}
      {!isLoading && !error && productos.length === 0 && (
        <div className="text-center py-10"><p className="text-gray-500">No hay productos disponibles.</p></div>
      )}
      {!isLoading && !error && productos.length > 0 && (
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
      )}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          Anterior
        </button>
        <span className="text-gray-700 font-medium">Pagina {page + 1}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}