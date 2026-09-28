import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8 p-4">
      <div className="container mx-auto text-center text-sm text-gray-600">
        <Link to="/arrepentimiento" className="text-blue-600 hover:underline font-medium">
          Boton de arrepentimiento
        </Link>
        <p className="mt-2">FrutiMix - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}