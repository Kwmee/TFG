import { HelpersIndexContext } from "../../INDEX/Helpers/HelpersIndex";
import { Link } from "react-router-dom";
import CarritoModal from "../Modal/CarritoModal";
import { useContext } from "react";
import { HelperModalContext } from "../Modal/Helper/HelperModal";
import { HelperLoginContext } from "../../LOGIN/Helpers/HelperLogin";


function NavbarRoutes() {
    // const [openCart, setOpenCart] = useState(false);

    let { openCart, setOpenCart } = useContext(HelperModalContext)
    const { usuarioLogeado, cargandoLogin, cerrarSesion } = useContext(HelperLoginContext);

    return (
        <>
            <header className="header" id="header">

                <div className="header-content">
                    <nav className="nav-left">

                        <Link to="/" className="nav-link">
                            Volver a inicio
                        </Link>


                    </nav>

                    <div className="logo-button">
                        <img src="logo.webp" alt="Hellborn Fest" className="logo" />
                    </div>

                    <nav className="nav-right">
                        <Link to="/Routes" className="nav-link">Route HF</Link>
                        <Link to="/Tienda" className="nav-link">Tienda</Link>
                        <Link to="/Tickets" className="nav-link-tickets">Tickets</Link>

                        {/* BOTÓN INICIO SESION */}
                        {usuarioLogeado ? (
                            <button
                                className="user-button"
                                aria-label="Cerrar sesión"
                                onClick={cerrarSesion}
                                title={`Cerrar sesión de ${usuarioLogeado.name}`}
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

                        {/* Boton carrito */}

                        <Link
                            className="user-button" onClick={() => setOpenCart(true)}>

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

                        </Link>
                    </nav>
                </div>
                <CarritoModal />
            </header>
        </>

    );


}

export default NavbarRoutes;
