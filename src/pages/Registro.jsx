import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrar, login } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    acepto_tratamiento: false,
  });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await registrar(form);
      const tokens = await login(form.email, form.password);
      iniciarSesion(tokens);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Crear cuenta</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={manejarEnvio} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={cambiar}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={cambiar}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={cambiar}
              required
              minLength={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="acepto_tratamiento"
              checked={form.acepto_tratamiento}
              onChange={cambiar}
              className="mt-1"
            />
            <label className="text-sm text-gray-700">
              Acepto que se guarden mi nombre y mi correo para gestionar mi cuenta y mis pedidos.
              Puedo verlos o pedir que los borren (Ley 25.326).
            </label>
          </div>
          <button
            type="submit"
            disabled={!form.acepto_tratamiento || enviando}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Ya tenes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesion</Link>
        </p>
      </div>
    </div>
  );
}