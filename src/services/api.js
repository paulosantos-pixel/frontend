const BASE_URL = import.meta.env.VITE_API_URL;

export function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- AUTH ---
export async function registrar(datos) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (res.status === 400) throw new Error("Ese email ya esta registrado");
  if (res.status === 422) throw new Error("Revisa los datos: la clave va de 8 caracteres para arriba");
  if (!res.ok) throw new Error("No se pudo crear la cuenta");
  return res.json();
}

export async function login(email, password) {
  const body = new URLSearchParams({ username: email, password });
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (res.status === 401) throw new Error("Email o contrasena incorrectos");
  if (!res.ok) throw new Error("No se pudo iniciar sesion");
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Sesion vencida");
  return res.json();
}

// --- PRODUCTOS ---
export async function getProductos({ page = 0, limit = 6, nombre = "" } = {}) {
  const params = new URLSearchParams({ skip: page * limit, limit });
  if (nombre) params.append("nombre", nombre);
  const res = await fetch(`${BASE_URL}/productos/?${params}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function crearProducto(datos) {
  const res = await fetch(`${BASE_URL}/productos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}

export async function actualizarProducto(id, datos) {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
}

export async function eliminarProducto(id) {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.json();
}

export async function subirImagen(productoId, archivo) {
  const fd = new FormData();
  fd.append("archivo", archivo);
  const r = await fetch(`${BASE_URL}/productos/${productoId}/imagen`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  });
  if (r.status === 413) throw new Error("La imagen pasa de 2 MB");
  if (r.status === 415) throw new Error("Ese archivo no es una imagen");
  if (r.status === 404) throw new Error("No existe ese producto");
  if (r.status === 403) throw new Error("No sos administrador");
  if (!r.ok) throw new Error("No se pudo subir la imagen");
  return r.json();
}

// --- PEDIDOS ---
export async function crearPedido(items) {
  const res = await fetch(`${BASE_URL}/pedidos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({
      items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
    }),
  });
  if (res.status === 401) throw new Error("Tu sesion vencio. Volve a entrar.");
  if (res.status === 409) {
    const { detail } = await res.json();
    throw new Error(detail);
  }
  if (!res.ok) throw new Error("No se pudo confirmar la compra");
  return res.json();
}

export async function getMisPedidos() {
  const res = await fetch(`${BASE_URL}/pedidos/mios`, { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar tus pedidos");
  return res.json();
}

export async function getTodosLosPedidos() {
  const res = await fetch(`${BASE_URL}/pedidos/todos`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Error al cargar los pedidos");
  return res.json();
}

export async function actualizarEstadoPedido(id, nuevoEstado) {
  const res = await fetch(`${BASE_URL}/pedidos/${id}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ estado: nuevoEstado }),
  });
  if (!res.ok) throw new Error("Error al actualizar el estado del pedido");
  return res.json();
}

// --- LEY 25.326 ---
export async function revocarPedido(pedidoId) {
  const res = await fetch(`${BASE_URL}/pedidos/${pedidoId}/revocacion`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (res.status === 404) throw new Error("No existe ese pedido o no es tuyo");
  if (res.status === 409) {
    const { detail } = await res.json();
    throw new Error(detail);
  }
  if (!res.ok) throw new Error("No se pudo revocar el pedido");
  return res.json();
}

export async function getMisDatos() {
  const res = await fetch(`${BASE_URL}/usuarios/me/datos`, { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar tus datos");
  return res.json();
}

export async function exportarMisDatos() {
  const res = await fetch(`${BASE_URL}/usuarios/me/exportar`, { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron exportar tus datos");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mis-datos.json";
  a.click();
  URL.revokeObjectURL(url);
}

export async function eliminarMiCuenta() {
  const res = await fetch(`${BASE_URL}/usuarios/me`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("No se pudo eliminar la cuenta");
  return res.json();
}