import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMisDatos, exportarMisDatos, eliminarMiCuenta } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";

const CONFIRMACION = "ELIMINAR";

export default function MisDatos() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [texto, setTexto] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const { cerrarSesion } = useAuth();
  const { vaciar } = useCarrito();
  const navigate = useNavigate();

  useEffect(() => {
    getMisDatos()
      .then(setDatos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  async function manejarExportar() {
    try {
      await exportarMisDatos();
    } catch (e) {
      setError(e.message);
    }
  }

  async function eliminar() {
    if (texto !== CONFIRMACION || eliminando) return;
    setEliminando(true);
    try {
      await eliminarMiCuenta();
      vaciar();
      cerrarSesion();
      navigate("/", { state: { mensaje: "Tu cuenta fue dada de baja." } });
    } catch (e) {
      setError(e.message);
      setEliminando(false);
    }
  }

  if (cargando) return <p className="text-center p-8">Cargando tus datos...</p>;
  if (error) return <p className="text-center p-8 text-red-600" role="alert">{error}</p>;
  if (!datos) return null;

  const fecha = (f) => f ? new Date(f).toLocaleString("es-AR") : "Sin fecha";

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Mis datos</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-xl font-bold mb-3">Datos que guardamos de vos</h2>
        <p><strong>Nombre:</strong> {datos.titular.nombre}</p>
        <p><strong>Email:</strong> {datos.titular.email}</p>
        <p><strong>Rol:</strong> {datos.titular.rol}</p>
        <p><strong>Alta:</strong> {fecha(datos.titular.alta)}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-xl font-bold mb-3">Consentimiento</h2>
        <p><strong>Otorgado:</strong> {datos.consentimiento.otorgado ? "Si" : "No"}</p>
        <p><strong>Fecha:</strong> {fecha(datos.consentimiento.fecha)}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-xl font-bold mb-3">Tus compras</h2>
        {datos.pedidos.length === 0 ? (
          <p className="text-gray-600">Todavia no hiciste compras.</p>
        ) : (
          datos.pedidos.map((p) => (
            <p key={p.id} className="text-sm">Pedido #{p.id} - {p.estado} - ${p.total}</p>
          ))
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-xl font-bold mb-3">Tus solicitudes de revocacion</h2>
        {datos.solicitudes_revocacion.length === 0 ? (
          <p className="text-gray-600">No tenes solicitudes.</p>
        ) : (
          datos.solicitudes_revocacion.map((s) => (
            <p key={s.codigo} className="text-sm"><code>{s.codigo}</code> - Pedido #{s.pedido_id}</p>
          ))
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">Exportar tus datos</h2>
        <p className="text-gray-700 mb-3">Descarga un archivo con todo lo que guardamos de vos.</p>
        <button onClick={manejarExportar} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Descargar mis datos
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-700 mb-3">Eliminar mi cuenta</h2>
        <p className="text-gray-700 mb-2">
          <strong>Que se borra:</strong> tu nombre, tu correo y tu contrasena.
        </p>
        <p className="text-gray-700 mb-3">
          <strong>Que queda:</strong> tus pedidos, sin datos que te identifiquen (obligacion contable).
        </p>
        <p className="text-gray-700 mb-2">Escribi <strong>{CONFIRMACION}</strong> para habilitar el boton:</p>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />
        <button
          onClick={eliminar}
          disabled={texto !== CONFIRMACION || eliminando}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {eliminando ? "Eliminando..." : "Eliminar mi cuenta"}
        </button>
      </div>
    </div>
  );
}