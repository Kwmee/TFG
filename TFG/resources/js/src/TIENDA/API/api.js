export async function getMerch(categoriaActiva) {
    const url = new URL(
        "https://lovely-creation-production-a868.up.railway.app/merchandising/" + categoriaActiva,
    );
    const datatype = await fetch(url);
    const datos = await datatype.json();
    if (!datos) {
        return [];
    } else {
        return datos;
    }
}

export async function getTickets() {
    const url = new URL(
        "https://lovely-creation-production-a868.up.railway.app/ticket/tickets",
    );  
    const datatype = await fetch(url);
    const datos = await datatype.json();
    if (!datos) {
        return [];
    } else {
        return datos;
    }
}
