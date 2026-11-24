import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCarrito, CarritoProvider } from "../context/CarritoContext";
import { useConectado } from "../hooks/useConectado";

// Test 1: El Carrito
function usarCarrito() {
  return renderHook(() => useCarrito(), { wrapper: CarritoProvider });
}

describe("Carrito", () => {
  it("agregar dos veces el mismo producto suma cantidad, no filas", () => {
    const { result } = usarCarrito();
    const mate = { id: 1, nombre: "Mate", precio_final: 1000 };

    act(() => result.current.agregar(mate));
    act(() => result.current.agregar(mate));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(2);
  });
});

// Test 2: El hook de conexión (Clase 12)
describe("useConectado", () => {
  it("arranca conectado y se entera cuando se corta", () => {
    const { result } = renderHook(() => useConectado());

    expect(result.current).toBe(true);

    act(() => window.dispatchEvent(new Event("offline")));
    expect(result.current).toBe(false);

    act(() => window.dispatchEvent(new Event("online")));
    expect(result.current).toBe(true);
  });
});