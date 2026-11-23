import { useState, useEffect, useRef } from "react";
import { getProductos, subirImagen } from "../services/api";
import { urlImagen } from "../utils/imagenes";

export default function PanelAdmin() {
  const [productos, setProductos] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const data = await getProductos({ limit: 50 });
      setProductos(data);
    } catch (e) {
      setError("Error al cargar productos");
    }
  }

  function elegirArchivo(e) {
    const f = e.target.files[0];
    if (!f) return;

    setError("");
    const TIPOS = ["image/jpeg", "image/png", "image/webp"];
    if (!TIPOS.includes(f.type)) {
      setError("Solo se permiten JPG, PNG o WEBP");
      setArchivo(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (f.size > 2 * 1024 * 1024) {
      setError("La imagen no puede superar los 2 MB");
      setArchivo(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setArchivo(f);
    setPreview(URL.createObjectURL(f));
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleSubir() {
    if (!archivo || !idSeleccionado) return;
    setSubiendo(true);
    setError("");
    try {
      await subirImagen(idSeleccionado, archivo);
      // Limpiar
      setArchivo(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      setIdSeleccionado(null);
      // Recargar la lista
      await cargarProductos();
      alert("Imagen subida con éxito");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de administración</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-bold mb-2">Subir imagen a un producto</h2>
        <select 
          className="border p-2 rounded mb-2 w-full"
          onChange={(e) => setIdSeleccionado(Number(e.target.value))}
          value={idSeleccionado || ""}
        >
          <option value="">Seleccioná un producto...</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>{p.nombre} (ID: {p.id})</option>
          ))}
        </select>

        <input 
          type="file" 
          accept="image/*"
          ref={inputRef}
          onChange={elegirArchivo}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
        />

        {preview && (
          <div className="mt-2 mb-2">
            <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
            <img src={preview} alt="Vista previa" className="h-32 object-cover rounded border" />
          </div>
        )}

        <button
          onClick={handleSubir}
          disabled={!archivo || !idSeleccionado || subiendo}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {subiendo ? "Subiendo..." : "Subir imagen"}
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-bold mb-2">Productos actuales</h2>
        <ul className="divide-y">
          {productos.map(p => (
            <li key={p.id} className="py-2 flex items-center justify-between">
              <span>{p.nombre}</span>
              {urlImagen(p) ? (
                <img src={urlImagen(p)} className="h-10 w-10 object-cover rounded" alt={p.nombre} />
              ) : (
                <span className="text-sm text-gray-400">Sin imagen</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}