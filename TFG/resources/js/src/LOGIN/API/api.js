export async function getUsuarioLogeado() {
  const usuarioGuardado = localStorage.getItem("usuarioLogeado");

  if (!usuarioGuardado) {
    return null;
  }

  return JSON.parse(usuarioGuardado);
}

export async function postLogin(datosFormulario) {
  const respuesta = await fetch("http://localhost:8080/usuario/login", {
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
  const respuesta = await fetch("http://localhost:8080/usuario/register", {
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
  const respuesta = await fetch(`http://localhost:8080/usuario?idAdmin=${idAdmin}`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function postHacerAdmin(datosFormulario) {
  const respuesta = await fetch("http://localhost:8080/usuario/admin", {
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
  const respuesta = await fetch("http://localhost:8080/usuario/admin/quitar", {
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
