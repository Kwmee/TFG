export async function getMerch(categoriaActiva) {
    const url = new URL(
        "https://tfg-production-5282.up.railway.app/merchandising/" + categoriaActiva,
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
        "https://tfg-production-5282.up.railway.app/ticket/tickets",
    );  
    const datatype = await fetch(url);
    const datos = await datatype.json();
    if (!datos) {
        return [];
    } else {
        return datos;
    }
}
