import { API_BASE_URL, buildApiUrl } from "../../config/api";

export async function getPerfilUsuario(idUsuario) {
  const respuesta = await fetch(
    buildApiUrl(API_BASE_URL, `/usuario/perfil?idUsuario=${idUsuario}`)
  );
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function putPerfilUsuario(idUsuario, datosFormulario) {
  const respuesta = await fetch(
    buildApiUrl(API_BASE_URL, `/usuario/perfil?idUsuario=${idUsuario}`),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(datosFormulario),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function getPedidosUsuario(idUsuario) {
  const respuesta = await fetch(
    buildApiUrl(API_BASE_URL, `/usuario/pedidos?idUsuario=${idUsuario}`)
  );
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function postCrearPedido(datosFormulario) {
  const respuesta = await fetch(buildApiUrl(API_BASE_URL, "/usuario/pedidos"), {
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
