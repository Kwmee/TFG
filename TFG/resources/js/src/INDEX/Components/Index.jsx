import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../Components/NavBars/NavBar'
import { ROUTE_API_BASE_URL, API_BASE_URL, buildApiUrl } from "../../config/api";
import { getMerch } from "../../TIENDA/API/api";

function Index() {
    const [ultimosEventos, setUltimosEventos] = useState([]);
    const [ultimosMerch, setUltimosMerch] = useState([]);
    const carruselEventosRef = useRef(null);
    const carruselMerchRef = useRef(null);

    useEffect(() => {
        async function cargarContenidoInicio() {
            try {
                const [respuestaEventos, merchandising] = await Promise.all([
                    fetch(buildApiUrl(ROUTE_API_BASE_URL || API_BASE_URL, "/filtro")),
                    getMerch("all"),
                ]);

                const eventos = await respuestaEventos.json();
                const eventosOrdenados = ordenarUltimosAñadidos(eventos || []);
                const merchandisingOrdenado = ordenarUltimosAñadidos(merchandising || []);

                setUltimosEventos(eventosOrdenados.slice(0, 12));
                setUltimosMerch(merchandisingOrdenado.slice(0, 12));
            } catch (error) {
                console.error("No se ha podido cargar el contenido destacado de inicio.", error);
                setUltimosEventos([]);
                setUltimosMerch([]);
            }
        }

        cargarContenidoInicio();
    }, []);

    function ordenarUltimosAñadidos(elementos) {
        if (!Array.isArray(elementos)) {
            return [];
        }

        const todosTienenId = elementos.every((elemento) => elemento?.id !== undefined && elemento?.id !== null);

        if (todosTienenId) {
            return [...elementos].sort((a, b) => Number(b.id) - Number(a.id));
        }

        return [...elementos].reverse();
    }

    function moverCarrusel(refCarrusel, direccion) {
        if (!refCarrusel.current) {
            return;
        }

        const distancia = refCarrusel.current.clientWidth * 0.8;
        refCarrusel.current.scrollBy({
            left: direccion * distancia,
            behavior: "smooth",
        });
    }

    return (
        <div>
            <Navbar />

            <section className="hero" id="inicio">
                <video autoPlay muted loop playsInline preload="metadata" className="bg-video" poster="logo.webp">
                    <source src="video-f.webm" type="video/webm" />
                    <source src="video.webm" type="video/webm" />
                </video>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">Abonos ya a la venta</h1>
                        <p className="hero-text">
                            Prepárate para una nueva edición de Hellborn Fest. Tenlo todo listo
                            para conseguir tu plaza. Te esperamos en esta nueva edición que
                            tendrá lugar el 1, 2, 3 y 4 de julio de 2026.
                        </p>
                        <Link to="/Tickets" className="hero-button">Tickets aquí</Link>
                    </div>
                </div>
            </section>

            <section className="inicio-carruseles">
                <div className="container">
                    <article className="inicio-bloque">
                        <div className="inicio-bloque-cabecera">
                            <div>
                                <p className="inicio-bloque-etiqueta">Route Hellborn</p>
                                <h2 className="inicio-bloque-titulo">Últimos eventos añadidos</h2>
                            </div>

                            <Link to="/Routes" className="inicio-boton-ver-mas">
                                Ver más
                            </Link>
                        </div>

                        <div className="inicio-carrusel-marco">
                            <button
                                type="button"
                                className="inicio-carrusel-flecha"
                                aria-label="Ver eventos anteriores"
                                onClick={() => moverCarrusel(carruselEventosRef, -1)}
                            >
                                ‹
                            </button>

                            <div className="inicio-carrusel" ref={carruselEventosRef}>
                                {ultimosEventos.map((evento, indice) => (
                                    <div className="inicio-card inicio-card-evento" key={evento.id ?? `${evento.nombre}-${indice}`}>
                                        <div className="inicio-card-imagen">
                                            <img src={evento.url_img} alt={evento.nombre} />
                                        </div>
                                        <div className="inicio-card-contenido">
                                            <p className="inicio-card-etiqueta">Evento</p>
                                            <h3 className="inicio-card-titulo">{evento.nombre}</h3>
                                            <p className="inicio-card-subtitulo">{evento.ciudad}</p>
                                            <p className="inicio-card-meta">{evento.fechaInicio}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="inicio-carrusel-flecha"
                                aria-label="Ver más eventos"
                                onClick={() => moverCarrusel(carruselEventosRef, 1)}
                            >
                                ›
                            </button>
                        </div>
                    </article>

                    <article className="inicio-bloque">
                        <div className="inicio-bloque-cabecera">
                            <div>
                                <p className="inicio-bloque-etiqueta">Tienda Hellborn</p>
                                <h2 className="inicio-bloque-titulo">Último merchandising añadido</h2>
                            </div>

                            <Link to="/Tienda" className="inicio-boton-ver-mas">
                                Ver más
                            </Link>
                        </div>

                        <div className="inicio-carrusel-marco">
                            <button
                                type="button"
                                className="inicio-carrusel-flecha"
                                aria-label="Ver productos anteriores"
                                onClick={() => moverCarrusel(carruselMerchRef, -1)}
                            >
                                ‹
                            </button>

                            <div className="inicio-carrusel" ref={carruselMerchRef}>
                                {ultimosMerch.map((producto, indice) => (
                                    <div className="inicio-card inicio-card-merch" key={producto.id ?? `${producto.nombre}-${indice}`}>
                                        <div className="inicio-card-imagen inicio-card-imagen-merch">
                                            <img src={producto.urlImg} alt={producto.nombre} />
                                        </div>
                                        <div className="inicio-card-contenido">
                                            <p className="inicio-card-etiqueta">{producto.tipo}</p>
                                            <h3 className="inicio-card-titulo">{producto.nombre}</h3>
                                            <p className="inicio-card-precio">{Number(producto.precio || 0).toFixed(2)}€</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="inicio-carrusel-flecha"
                                aria-label="Ver más productos"
                                onClick={() => moverCarrusel(carruselMerchRef, 1)}
                            >
                                ›
                            </button>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default Index
