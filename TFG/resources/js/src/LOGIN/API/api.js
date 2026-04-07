function getCsrfToken() {
  return document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
}

async function peticionAuth(url, opciones = {}) {
  const respuesta = await fetch(url, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
      Accept: "application/json",
      ...opciones.headers,
    },
    ...opciones,
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function getUsuarioLogeado() {
  const respuesta = await fetch("/usuario", {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  const datos = await respuesta.json();
  return datos.usuario;
}

export async function postLogin(datosFormulario) {
  const datos = await peticionAuth("/login", {
    method: "POST",
    body: JSON.stringify(datosFormulario),
  });

  return datos.usuario;
}

export async function postRegister(datosFormulario) {
  const datos = await peticionAuth("/register", {
    method: "POST",
    body: JSON.stringify(datosFormulario),
  });

  return datos.usuario;
}

export async function postLogout() {
  return peticionAuth("/logout", {
    method: "POST",
  });
}
