import { useAuth } from "../context/AuthContext";

export default function MiCuenta() {
  const { usuario } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Mi cuenta</h1>
        <p><strong>Nombre:</strong> {usuario?.nombre}</p>
        <p><strong>Email:</strong> {usuario?.email}</p>
        <p><strong>Rol:</strong> {usuario?.rol}</p>
      </div>
    </div>
  );
}