import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RutaProtegida from "./components/RutaProtegida";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MiCuenta from "./pages/MiCuenta";
import PanelAdmin from "./pages/PanelAdmin";
import Carrito from "./pages/Carrito";
import MisPedidos from "./pages/MisPedidos";
import MisDatos from "./pages/MisDatos";
import Arrepentimiento from "./pages/Arrepentimiento";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Catalogo />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/arrepentimiento" element={<Arrepentimiento />} />
                <Route element={<RutaProtegida />}>
                  <Route path="/mi-cuenta" element={<MiCuenta />} />
                  <Route path="/mis-pedidos" element={<MisPedidos />} />
                  <Route path="/mis-datos" element={<MisDatos />} />
                </Route>
                <Route element={<RutaProtegida rol="admin" />}>
                  <Route path="/admin" element={<PanelAdmin />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;