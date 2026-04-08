import { API_BASE_URL, buildApiUrl } from "../../config/api";

export async function getMerch(categoriaActiva) {
    const url = new URL(buildApiUrl(API_BASE_URL, `/merchandising/${categoriaActiva}`));
    const datatype = await fetch(url);
    const datos = await datatype.json();
    if (!datos) {
        return [];
    } else {
        return datos;
    }
}

export async function getTickets() {
    const url = new URL(buildApiUrl(API_BASE_URL, "/ticket/tickets"));
    const datatype = await fetch(url);
    const datos = await datatype.json();
    if (!datos) {
        return [];
    } else {
        return datos;
    }
}
