export async function getUsuarioLogeado() {
  const usuarioGuardado = localStorage.getItem("usuarioLogeado");

  if (!usuarioGuardado) {
    return null;
  }

  return JSON.parse(usuarioGuardado);
}

export async function postLogin(datosFormulario) {
  const respuesta = await fetch("https://tfg-production-5282.up.railway.app/usuario/login", {
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
  const respuesta = await fetch("https://tfg-production-5282.up.railway.app/usuario/register", {
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
  const respuesta = await fetch(`https://tfg-production-5282.up.railway.app/usuario?idAdmin=${idAdmin}`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function postHacerAdmin(datosFormulario) {
  const respuesta = await fetch("https://tfg-production-5282.up.railway.app/usuario/admin", {
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
  const respuesta = await fetch("https://tfg-production-5282.up.railway.app/usuario/admin/quitar", {
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
