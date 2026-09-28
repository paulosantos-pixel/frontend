import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">FrutiMix</Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Catalogo</Link>
          <span className="text-gray-600">Carrito (0)</span>
          {usuario ? (
            <>
              <span className="text-gray-700">Hola, {usuario.nombre}</span>
              {usuario.rol === "admin" && (
                <Link to="/admin" className="text-gray-600 hover:text-blue-600">Admin</Link>
              )}
              <button
                onClick={cerrarSesion}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Entrar</Link>
              <Link to="/registro" className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Registrarse</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}