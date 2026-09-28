import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Arrepentimiento() {
  const { usuario } = useAuth();

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Boton de arrepentimiento</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Tu derecho a arrepentirte</h2>
        <p className="text-gray-700 mb-3">
          Si compraste algo en FrutiMix, tenes derecho a cancelar la compra
          dentro de los <strong>10 dias corridos</strong> desde que la hiciste.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><strong>Sin costo:</strong> no te vamos a cobrar nada por cancelar.</li>
          <li><strong>Sin justificar:</strong> no tenes que explicar por que te arrepentiste.</li>
          <li><strong>Los gastos de devolucion los paga el vendedor.</strong></li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {usuario ? (
          <>
            <p className="text-gray-700 mb-4">Ya tenes sesion iniciada. Podes ver y revocar tus pedidos.</p>
            <Link to="/mis-pedidos" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Ir a mis pedidos
            </Link>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-4">
              Para ejercer este derecho necesitamos que te identifiques. Es la forma
              de asegurarnos de que cancelas tus propias compras y no las de otra persona.
            </p>
            <Link to="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Iniciar sesion
            </Link>
          </>
        )}
      </div>
    </div>
  );
}