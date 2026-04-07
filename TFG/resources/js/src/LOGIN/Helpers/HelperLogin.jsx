import { createContext, useEffect, useState } from "react";
import {
  getUsuarioLogeado,
  postLogin,
  postLogout,
} from "../API/api";

export const HelperLoginContext = createContext();

export const HelperLoginProvider = ({ children }) => {
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);
  const [erroresLogin, setErroresLogin] = useState({});
  const [cargandoLogin, setCargandoLogin] = useState(true);

  useEffect(() => {
    async function iniciar() {
      try {
        const usuario = await getUsuarioLogeado();
        setUsuarioLogeado(usuario);
      } catch {
        setUsuarioLogeado(null);
      } finally {
        setCargandoLogin(false);
      }
    }

    iniciar();
  }, []);

  async function iniciarSesion(datosFormulario) {
    setErroresLogin({});

    try {
      const usuario = await postLogin(datosFormulario);
      setUsuarioLogeado(usuario);
      return { ok: true };
    } catch (error) {
      setErroresLogin(error.errors ?? {});

      return {
        ok: false,
        mensaje: error.message ?? "No se pudo iniciar sesion.",
      };
    }
  }

  async function cerrarSesion() {
    await postLogout();
    setUsuarioLogeado(null);
    setErroresLogin({});
  }

  return (
    <HelperLoginContext.Provider
      value={{
        usuarioLogeado,
        setUsuarioLogeado,
        erroresLogin,
        setErroresLogin,
        cargandoLogin,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </HelperLoginContext.Provider>
  );
};
