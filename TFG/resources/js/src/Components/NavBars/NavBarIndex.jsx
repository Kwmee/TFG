import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarritoModal from "../Modal/CarritoModal";
import { HelperModalContext } from "../Modal/Helper/HelperModal";
import { HelperLoginContext } from "../../LOGIN/Helpers/HelperLogin";


function NavBarIndex() {

    const { setOpenCart } = useContext(HelperModalContext);
    const { usuarioLogeado, cargandoLogin, cerrarSesion } = useContext(HelperLoginContext);
    const [menuAbierto, setMenuAbierto] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuAbierto ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuAbierto]);

    function cerrarMenu() {
        setMenuAbierto(false);
    }

    function abrirCarrito() {
        cerrarMenu();
        setOpenCart(true);
    }

    function handleCerrarSesion() {
        cerrarMenu();
        cerrarSesion();
    }

    return (
        <>
            <header className="header" id="header">
                {menuAbierto && <button className="mobile-menu-overlay" type="button" aria-label="Cerrar menú" onClick={cerrarMenu} />}
                <div className="header-content">
                    <button
                        type="button"
                        className={`mobile-menu-button ${menuAbierto ? "is-open" : ""}`}
                        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={menuAbierto}
                        onClick={() => setMenuAbierto((prev) => !prev)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>

                    <nav className="nav-left" />

                    <div className="logo-button">
                        <img src="logo.webp" alt="Hellborn Fest" className="logo" loading="eager" />
                    </div>

                    <nav className={`nav-right ${menuAbierto ? "mobile-open" : ""}`}>
                        <Link to="/Routes" className="nav-link" onClick={cerrarMenu}>Route HF</Link>
                        <Link to="/Tienda" className="nav-link" onClick={cerrarMenu}>Tienda</Link>
                        <Link to="/Tickets" className="nav-link-tickets" onClick={cerrarMenu}>Tickets</Link>
                        {usuarioLogeado?.rol === "ADMIN" && (
                            <Link to="/admin" className="nav-link" onClick={cerrarMenu}>Admin</Link>
                        )}

                        {/* BOTÓN INICIO SESION */}
                        {usuarioLogeado ? (
                            <button
                                className="user-button"
                                aria-label="Cerrar sesión"
                                onClick={handleCerrarSesion}
                                title={`Cerrar sesión de ${usuarioLogeado.nombreUsuario}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 16l4-4-4-4" />
                                    <path d="M21 12H9" />
                                    <path d="M13 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" />
                                </svg>
                            </button>
                        ) : (
                            <Link
                                className="user-button"
                                aria-label={cargandoLogin ? "Cargando usuario" : "Iniciar sesión"}
                                to="/LoginModal"
                                onClick={cerrarMenu}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </Link>
                        )}

                        {/* CARRITO  */}


                        <button
                            type="button"
                            className="user-button"
                            aria-label="Abrir carrito"
                            onClick={abrirCarrito}>

                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>

                        </button>

                    </nav>
                </div>
                <CarritoModal />
            </header >
        </>
    );


}



export default NavBarIndex;
