import { createPortal } from "react-dom";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HelperModalContext } from "./Helper/HelperModal";
import { HelperLoginContext } from "../../LOGIN/Helpers/HelperLogin";
import { postCrearPedido } from "../../USUARIO/API/api";

function CarritoModal() {
    const { openCart, setOpenCart, arrMerch, arrTicket, removeMerch, removeTicket, vaciarCarrito } =
        useContext(HelperModalContext);
    const { usuarioLogeado } = useContext(HelperLoginContext);
    const [procesandoCompra, setProcesandoCompra] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const [pedidoRealizado, setPedidoRealizado] = useState(null);

    const total = [...arrMerch, ...arrTicket].reduce(
        (acumulado, item) => acumulado + Number(item.precio || 0) * (item.cantidad || 1),
        0,
    );

    useEffect(() => {
        if (openCart || pedidoRealizado) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [openCart, pedidoRealizado]);

    async function finalizarCompra() {
        if (arrMerch.length === 0 && arrTicket.length === 0) {
            return;
        }

        if (!usuarioLogeado?.id) {
            setMensajeError("Debes iniciar sesión para finalizar la compra.");
            return;
        }

        setProcesandoCompra(true);
        setMensajeError("");

        try {
            const pedidoCreado = await postCrearPedido({
                idUsuario: usuarioLogeado.id,
                lineas: [
                    ...arrMerch.map((producto) => ({
                        tipo: "MERCH",
                        idReferencia: producto.id,
                        cantidad: producto.cantidad || 1,
                    })),
                    ...arrTicket.map((producto) => ({
                        tipo: "TICKET",
                        idReferencia: producto.id,
                        cantidad: producto.cantidad || 1,
                    })),
                ],
            });

            vaciarCarrito();
            setOpenCart(false);
            setPedidoRealizado(pedidoCreado);
        } catch (error) {
            setMensajeError(error.message ?? "No se ha podido completar la compra.");
        } finally {
            setProcesandoCompra(false);
        }
    }

    if (!openCart && !pedidoRealizado) return null;

    return createPortal(
        <>
            {openCart ? (
                <button
                    className="cart-overlay"
                    type="button"
                    aria-label="Cerrar carrito"
                    onClick={() => setOpenCart(false)}
                />
            ) : null}

            {openCart ? (
                <div className="cart-drawer">
                    <div className="cart-header">
                        <h3>Tu carrito</h3>
                        <button className="btn-close" onClick={() => setOpenCart(false)}>
                            ×
                        </button>
                    </div>

                    <div className="cart-body">
                        {arrMerch.length === 0 && arrTicket.length === 0 ? (
                            <p className="cart-empty">Tu carrito está vacío.</p>
                        ) : null}

                        {arrMerch.map((elemento, index) => (
                            <div key={elemento.cartId ?? index} className="cart-product">
                                <div className="cart-text">
                                    <img src={elemento.urlImg} alt="" className="cart-imgMerch" />

                                    <div>
                                        <p>{elemento.nombre}</p>
                                        <p className="cart-cantidad">Cantidad: {elemento.cantidad || 1}</p>
                                        <strong className="cart-precio">
                                            {elemento.precio}€
                                        </strong>
                                    </div>
                                </div>
                                <button onClick={() => removeMerch(elemento.cartId)} className="cart-btn">
                                    🗑️
                                </button>
                                <hr />
                            </div>
                        ))}

                        {arrTicket.map((elemento, index) => (
                            <div key={elemento.cartId ?? index} className="cart-product">
                                <div className="cart-text cart-text-ticket">
                                    <div className="cart-ticket-copy">
                                        <p>{elemento.categoria}</p>
                                        <p className="cart-cantidad">Cantidad: {elemento.cantidad || 1}</p>
                                        <strong className="cart-precio">
                                            {elemento.precio}€
                                        </strong>
                                    </div>
                                </div>
                                <button onClick={() => removeTicket(elemento.cartId)} className="cart-btn">
                                    🗑️
                                </button>
                                <hr />
                            </div>
                        ))}
                    </div>

                    <div className="cart-footer">
                        {mensajeError ? <p className="cart-error">{mensajeError}</p> : null}
                        <p className="cart-total">Total: {total.toFixed(2)}€</p>
                        <button className="checkout-btn" type="button" onClick={finalizarCompra} disabled={procesandoCompra}>
                            {procesandoCompra ? "PROCESANDO..." : "FINALIZAR COMPRA"}
                        </button>
                    </div>
                </div>
            ) : null}

            {pedidoRealizado ? (
                <div className="purchase-popup-overlay" role="dialog" aria-modal="true">
                    <div className="purchase-popup">
                        <h3>Compra realizada</h3>
                        <p>
                            Tu pedido se ha guardado correctamente y ya aparece en tu página de usuario.
                        </p>
                        <p className="purchase-popup-total">
                            Total: {Number(pedidoRealizado.total || 0).toFixed(2)}€
                        </p>
                        <div className="purchase-popup-actions">
                            <button
                                type="button"
                                className="checkout-btn"
                                onClick={() => setPedidoRealizado(null)}
                            >
                                Seguir comprando
                            </button>
                            <Link
                                to="/usuario"
                                className="checkout-btn checkout-btn-secondary"
                                onClick={() => setPedidoRealizado(null)}
                            >
                                Ver usuario
                            </Link>
                        </div>
                    </div>
                </div>
            ) : null}
        </>,
        document.body,
    );
}

export default CarritoModal;
