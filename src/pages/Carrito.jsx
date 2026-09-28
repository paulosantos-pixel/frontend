import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { crearPedido } from "../services/api";

export default function Carrito() {
  const { items, quitar, vaciar, total } = useCarrito();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function confirmar() {
    if (enviando) return;
    setEnviando(true);
    setError(null);
    try {
      await crearPedido(items);
      vaciar();
      navigate("/mis-pedidos");
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Tu carrito esta vacio</h1>
        <Link to="/" className="text-blue-600 hover:underline">Volver al catalogo</Link>
      </div>
    );
  }

  const totalFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", minimumFractionDigits: 0,
  }).format(total);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Tu carrito</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        {items.map((item) => (
          <div key={item.producto_id} className="flex items-center gap-4 border-b py-3 last:border-b-0">
            <img src={item.imagen_url} alt={item.nombre} className="w-16 h-16 object-cover rounded" />
            <div className="flex-grow">
              <h3 className="font-medium">{item.nombre}</h3>
              <p className="text-sm text-gray-600">
                {item.cantidad} x ${item.precio}
              </p>
            </div>
            <button onClick={() => quitar(item.producto_id)} className="text-red-600 hover:text-red-800">Quitar</button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-xl font-bold text-right mb-4">Total: {totalFormateado}</p>
        <button
          onClick={confirmar}
          disabled={enviando || items.length === 0}
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {enviando ? "Confirmando..." : "Confirmar compra"}
        </button>
      </div>
    </div>
  );
}