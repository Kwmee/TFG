function getCsrfToken() {
  return document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
}

export async function getConciertosAdmin(idAdmin, rolAdmin) {
  const parametros = new URLSearchParams({
    idAdmin: String(idAdmin),
    rolAdmin: rolAdmin ?? "",
  });

  const respuesta = await fetch(`/admin/conciertos?${parametros.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function postCrearConcierto(datosFormulario) {
  const respuesta = await fetch("/admin/conciertos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-TOKEN": getCsrfToken() ?? "",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(datosFormulario),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function deleteConcierto(idConcierto, idAdmin, rolAdmin) {
  const parametros = new URLSearchParams({
    idAdmin: String(idAdmin),
    rolAdmin: rolAdmin ?? "",
  });

  const respuesta = await fetch(`/admin/conciertos/${idConcierto}?${parametros.toString()}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "X-CSRF-TOKEN": getCsrfToken() ?? "",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}
