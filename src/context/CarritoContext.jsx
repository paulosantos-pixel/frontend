import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("carrito")) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  function agregar(producto, cantidad = 1) {
    setItems((prev) => {
      const yaEsta = prev.find((i) => i.producto_id === producto.id);
      if (yaEsta) {
        return prev.map((i) =>
          i.producto_id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [
        ...prev,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio_final,
          imagen_url: producto.imagen_url,
          cantidad,
        },
      ];
    });
  }

  function quitar(producto_id) {
    setItems((prev) => prev.filter((i) => i.producto_id !== producto_id));
  }

  function vaciar() {
    setItems([]);
  }

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, vaciar, total, cantidadTotal }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);