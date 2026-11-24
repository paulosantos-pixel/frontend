import { useState, useEffect, useRef } from "react";
import { getProductos, subirImagen, crearProducto, actualizarProducto, eliminarProducto, getTodosLosPedidos, actualizarEstadoPedido, eliminarPedido } from "../services/api";
import { urlImagen } from "../utils/imagenes";

export default function PanelAdmin() {
  const [tab, setTab] = useState("productos");
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Estados del formulario de productos
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio_final: 0, stock: 0 });

  // Estados de la imagen
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    cargarDatos();
  }, [tab]);

  async function cargarDatos() {
    setError("");
    try {
      if (tab === "productos") {
        const data = await getProductos({ limit: 100 });
        setProductos(data);
      } else {
        const data = await getTodosLosPedidos();
        setPedidos(data);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  // --- LÓGICA DE PRODUCTOS ---
  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardarProducto(e) {
    e.preventDefault();
    setMensaje("");
    setError("");
    try {
      const payload = {
        ...form,
        precio_final: parseFloat(form.precio_final),
        stock: parseInt(form.stock),
        categoria_id: 1,
        cuotas_cantidad: 0, cuotas_valor: 0, garantia_meses: 0
      };

      if (editandoId) {
        await actualizarProducto(editandoId, payload);
        setMensaje("Producto actualizado con éxito");
      } else {
        await crearProducto(payload);
        setMensaje("Producto creado con éxito");
      }
      
      setForm({ nombre: "", descripcion: "", precio_final: 0, stock: 0 });
      setEditandoId(null);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  function prepararEdicion(prod) {
    setEditandoId(prod.id);
    setForm({
      nombre: prod.nombre,
      descripcion: prod.descripcion || "",
      precio_final: prod.precio_final,
      stock: prod.stock
    });
    window.scrollTo(0, 0);
  }

  async function borrarProducto(id) {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      setMensaje("Producto eliminado");
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  // --- LÓGICA DE IMAGEN ---
  function elegirArchivo(e) {
    const f = e.target.files[0];
    if (!f) return;
    setError("");
    if (f.size > 2 * 1024 * 1024) {
      setError("La imagen no puede superar los 2 MB");
      return;
    }
    setArchivo(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubir() {
    if (!archivo || !idSeleccionado) return;
    setSubiendo(true);
    try {
      await subirImagen(idSeleccionado, archivo);
      setArchivo(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      setMensaje("Imagen subida correctamente");
      cargarDatos();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubiendo(false);
    }
  }

  // --- LÓGICA DE PEDIDOS ---
  async function handleCambiarEstado(id, nuevoEstado) {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      setMensaje("Estado del pedido actualizado correctamente");
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleBorrarPedido(id) {
    const pwd = prompt("Para eliminar este pedido permanentemente, ingresá tu contraseña de administrador:");
    if (!pwd) return;
    
    try {
      await eliminarPedido(id, pwd);
      setMensaje("Pedido eliminado correctamente");
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración</h1>
      
      {/* PESTAÑAS */}
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 font-bold ${tab === "productos" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => { setTab("productos"); setMensaje(""); setError(""); }}
        >
          Gestión de Productos
        </button>
        <button 
          className={`py-2 px-4 font-bold ${tab === "pedidos" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => { setTab("pedidos"); setMensaje(""); setError(""); }}
        >
          Pedidos de Clientes
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {mensaje && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{mensaje}</div>}

      {/* CONTENIDO: PRODUCTOS */}
      {tab === "productos" && (
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4">{editandoId ? "Editar Producto" : "Nuevo Producto"}</h2>
            <form onSubmit={guardarProducto} className="space-y-3">
              <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleFormChange} required className="w-full border p-2 rounded" />
              <input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleFormChange} className="w-full border p-2 rounded" />
              <input type="number" name="precio_final" placeholder="Precio" value={form.precio_final} onChange={handleFormChange} required className="w-full border p-2 rounded" />
              <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleFormChange} required className="w-full border p-2 rounded" />
              
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                {editandoId ? "Guardar Cambios" : "Crear Producto"}
              </button>
              {editandoId && (
                <button type="button" onClick={() => { setEditandoId(null); setForm({ nombre: "", descripcion: "", precio_final: 0, stock: 0 }); }} className="w-full bg-gray-300 text-gray-800 py-2 rounded font-bold mt-2">
                  Cancelar Edición
                </button>
              )}
            </form>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
            <div className="space-y-4">
              {productos.map(p => (
                <div key={p.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-4">
                    {urlImagen(p) ? (
                      <img src={urlImagen(p)} alt={p.nombre} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Sin img</div>
                    )}
                    <div>
                      <p className="font-bold">{p.nombre}</p>
                      <p className="text-sm text-gray-500">${p.precio_final} - Stock: {p.stock}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => prepararEdicion(p)} className="text-blue-600 hover:underline text-sm font-bold">Editar</button>
                    <button onClick={() => borrarProducto(p.id)} className="text-red-600 hover:underline text-sm font-bold">Borrar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 bg-gray-50 p-6 rounded-lg shadow-inner mt-4 border">
            <h2 className="text-xl font-bold mb-4">Subir Imagen a un Producto</h2>
            <div className="flex gap-4 items-center">
              <select className="border p-2 rounded" onChange={(e) => setIdSeleccionado(Number(e.target.value))} value={idSeleccionado || ""}>
                <option value="">Seleccioná un producto...</option>
                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>

              <input type="file" accept="image/*" ref={inputRef} onChange={elegirArchivo} className="text-sm" />

              <button onClick={handleSubir} disabled={!archivo || !idSeleccionado || subiendo} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">
                {subiendo ? "Subiendo..." : "Subir Foto"}
              </button>

              {preview && <img src={preview} alt="Preview" className="h-12 w-12 object-cover rounded ml-4 border" />}
            </div>
          </div>

        </div>
      )}

      {/* CONTENIDO: PEDIDOS */}
      {tab === "pedidos" && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Historial de Ventas</h2>
          {pedidos.length === 0 ? (
            <p className="text-gray-500">No hay pedidos registrados aún.</p>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Cliente (ID)</th>
                  <th className="p-3 border-b">Fecha</th>
                  <th className="p-3 border-b">Estado</th>
                  <th className="p-3 border-b">Total</th>
                  <th className="p-3 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(pedido => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-bold">#{pedido.id}</td>
                    <td className="p-3 border-b">{pedido.usuario_id}</td>
                    <td className="p-3 border-b">{new Date(pedido.creado_en).toLocaleDateString()}</td>
                    
                    <td className="p-3 border-b">
                      <select 
                        value={pedido.estado}
                        onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
                        className={`p-1 rounded font-bold text-xs uppercase border cursor-pointer ${
                          pedido.estado === 'cancelado' ? 'bg-red-100 text-red-800 border-red-300' :
                          pedido.estado === 'pagado' ? 'bg-green-100 text-green-800 border-green-300' :
                          pedido.estado === 'enviado' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                          'bg-blue-100 text-blue-800 border-blue-300'
                        }`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    
                    <td className="p-3 border-b font-bold text-green-600">${pedido.total}</td>
                    
                    <td className="p-3 border-b">
                      <button 
                        onClick={() => handleBorrarPedido(pedido.id)} 
                        className="text-red-600 hover:underline text-xs font-bold uppercase"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}