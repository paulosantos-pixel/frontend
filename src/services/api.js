const BASE_URL = import.meta.env.VITE_API_URL;

// ==================== AUTH ====================
function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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

// ==================== PRODUCTOS ====================
export async function getProductos({ page = 0, limit = 6, nombre = "" } = {}) {
  const params = new URLSearchParams({ skip: page * limit, limit });
  if (nombre) params.append("nombre", nombre);
  const res = await fetch(`${BASE_URL}/productos/?${params}`);
  if (!res.ok) throw new Error(`Error ${res.status} al pedir los productos`);
  return res.json();
}