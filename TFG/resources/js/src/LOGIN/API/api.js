import { API_BASE_URL, buildApiUrl } from "../../config/api";

export async function getUsuarioLogeado() {
  const usuarioGuardado = localStorage.getItem("usuarioLogeado");

  if (!usuarioGuardado) {
    return null;
  }

  return JSON.parse(usuarioGuardado);
}

export async function postLogin(datosFormulario) {
  const respuesta = await fetch(buildApiUrl(API_BASE_URL, "/usuario/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(datosFormulario),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  localStorage.setItem("usuarioLogeado", JSON.stringify(datos));
  return datos;
}

export async function postRegister(datosFormulario) {
  const respuesta = await fetch(buildApiUrl(API_BASE_URL, "/usuario/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(datosFormulario),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function getUsuarios(idAdmin) {
  const respuesta = await fetch(buildApiUrl(API_BASE_URL, `/usuario?idAdmin=${idAdmin}`));
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function postHacerAdmin(datosFormulario) {
  const respuesta = await fetch(buildApiUrl(API_BASE_URL, "/usuario/admin"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(datosFormulario),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function postQuitarAdmin(datosFormulario) {
  const respuesta = await fetch(buildApiUrl(API_BASE_URL, "/usuario/admin/quitar"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(datosFormulario),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function postLogout() {
  localStorage.removeItem("usuarioLogeado");
  return { ok: true };
}
