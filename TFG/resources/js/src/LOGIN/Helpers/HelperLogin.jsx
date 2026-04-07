import { createContext, useEffect, useState } from "react";
import {
  getUsuarioLogeado,
  postLogin,
  postLogout,
  postRegister,
} from "../API/api";

export const HelperLoginContext = createContext();

export const HelperLoginProvider = ({ children }) => {
  
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);
  const [erroresLogin, setErroresLogin] = useState({});
  const [erroresRegister, setErroresRegister] = useState({});
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

  async function registrarUsuario(datosFormulario) {
    setErroresRegister({});

    try {
      const usuario = await postRegister(datosFormulario);
      return { ok: true, usuario };
    } catch (error) {
      setErroresRegister(error.errors ?? {});

      return {
        ok: false,
        mensaje: error.message ?? "No se pudo registrar el usuario.",
      };
    }
  }

  return (
    <HelperLoginContext.Provider
      value={{
        usuarioLogeado,
        setUsuarioLogeado,
        erroresLogin,
        setErroresLogin,
        erroresRegister,
        setErroresRegister,
        cargandoLogin,
        iniciarSesion,
        cerrarSesion,
        registrarUsuario,
      }}
    >
      {children}
    </HelperLoginContext.Provider>
  );
};
