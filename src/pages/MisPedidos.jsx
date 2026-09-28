import { useState, useEffect } from "react";
import { getMisPedidos } from "../services/api";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMisPedidos()
      .then(setPedidos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="text-center p-8">Cargando tus compras...</p>;
  if (error) return <p className="text-center p-8 text-red-600" role="alert">{error}</p>;
  if (pedidos.length === 0) return <p className="text-center p-8 text-gray-600">Todavia no compraste nada.</p>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Mis pedidos</h1>
      {pedidos.map((pedido) => (
        <div key={pedido.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Pedido #{pedido.id}</h2>
            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{pedido.estado}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Fecha: {new Date(pedido.creado_en).toLocaleDateString("es-AR")}</p>
          <div className="border-t pt-2">
            {pedido.items.map((item) => (
              <p key={item.id} className="text-sm">
                Producto #{item.producto_id} - {item.cantidad} x ${item.precio_unitario}
              </p>
            ))}
          </div>
          <p className="text-lg font-bold text-right mt-2">Total: ${pedido.total}</p>
        </div>
      ))}
    </div>
  );
}