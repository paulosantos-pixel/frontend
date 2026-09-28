import { useState, useEffect } from "react";
import { getMisPedidos, revocarPedido } from "../services/api";

const DIAS_PARA_REVOCAR = 10;

function puedeRevocar(pedido) {
  if (pedido.estado === "cancelado") return false;
  const ms = Date.now() - new Date(pedido.creado_en);
  return ms / 86400000 <= DIAS_PARA_REVOCAR;
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [codigo, setCodigo] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function cargar() {
    try {
      const data = await getMisPedidos();
      setPedidos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function revocar(pedidoId) {
    const ok = window.confirm("Cancelar esta compra? Vas a recibir un codigo.");
    if (!ok || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      const solicitud = await revocarPedido(pedidoId);
      setCodigo(solicitud.codigo);
      await cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) return <p className="text-center p-8">Cargando tus compras...</p>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Mis pedidos</h1>

      {codigo && (
        <div role="status" className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4">
          <strong>Solicitud registrada.</strong>
          <p>Tu codigo de seguimiento es <code className="bg-green-200 px-2 py-1 rounded">{codigo}</code></p>
          <p className="text-sm">Guardalo: es el comprobante de que pediste la cancelacion.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {pedidos.length === 0 ? (
        <p className="text-center text-gray-600">Todavia no compraste nada.</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">Pedido #{pedido.id}</h2>
              <span className={`text-sm px-2 py-1 rounded ${pedido.estado === "cancelado" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                {pedido.estado}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Fecha: {new Date(pedido.creado_en).toLocaleDateString("es-AR")}</p>
            <div className="border-t pt-2 mb-2">
              {pedido.items.map((item) => (
                <p key={item.id} className="text-sm">Producto #{item.producto_id} - {item.cantidad} x ${item.precio_unitario}</p>
              ))}
            </div>
            <p className="text-lg font-bold text-right mb-2">Total: ${pedido.total}</p>
            {puedeRevocar(pedido) && (
              <button
                onClick={() => revocar(pedido.id)}
                disabled={enviando}
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:bg-gray-300"
              >
                {enviando ? "Cancelando..." : "Arrepentirme de esta compra"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}