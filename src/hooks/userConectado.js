import { useState, useEffect } from "react";

export function useConectado() {
  const [conectado, setConectado] = useState(navigator.onLine);

  useEffect(() => {
    const si = () => setConectado(true);
    const no = () => setConectado(false);

    window.addEventListener("online", si);
    window.addEventListener("offline", no);

    return () => {
      window.removeEventListener("online", si);
      window.removeEventListener("offline", no);
    };
  }, []);

  return conectado;
}