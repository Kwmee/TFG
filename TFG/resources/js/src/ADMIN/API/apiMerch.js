export async function getMerchAdmin(idAdmin) {
  const respuesta = await fetch(`https://lovely-creation-production-a868.up.railway.app/merchandising/admin?idAdmin=${idAdmin}`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}

export async function postCrearMerch(idAdmin, datosFormulario) {
  const respuesta = await fetch(`https://lovely-creation-production-a868.up.railway.app/merchandising/admin?idAdmin=${idAdmin}`, {
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

export async function deleteMerch(idAdmin, idMerch) {
  const respuesta = await fetch(`https://lovely-creation-production-a868.up.railway.app/merchandising/admin/${idMerch}?idAdmin=${idAdmin}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (respuesta.status === 204) {
    return { ok: true };
  }

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
}
