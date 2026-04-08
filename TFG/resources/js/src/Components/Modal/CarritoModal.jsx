//Importamos la función de React para renderizar un componente en otro lugar del DOM que no sea el div raíz (#root) por ejemplo document.x
import { createPortal } from "react-dom";
import { useContext, useEffect, useState } from "react";
import { HelperModalContext } from "./Helper/HelperModal";

// Recibe dos props: open → booleano que dice si el carrito está abierto
// onClose → función que cierra el carrito
function CarritoModal() {
    let { openCart, setOpenCart } = useContext(HelperModalContext);

    const { arrMerch, arrTicket, removeMerch, removeTicket } =
        useContext(HelperModalContext);
    const total = [...arrMerch, ...arrTicket].reduce(
        (acumulado, item) => acumulado + Number(item.precio || 0) * (item.cantidad || 1),
        0,
    );

    // Este efecto se ejecuta cada vez que cambia open.
    // Si open == true: Bloquea el scroll de la página.
    // Si open == false: Lo vuelve a activar.
    // Sin esto, podrías scrollear la web debajo del carrito.
    useEffect(() => {
        if (openCart) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [openCart]);
    // El [open] significa: Solo ejecuta esto cuando cambie open.

    // Si no esta abierto no se renderiza nada.
    if (!openCart) return null;

    return createPortal(
        <>
            <button className="cart-overlay" type="button" aria-label="Cerrar carrito" onClick={() => setOpenCart(false)} />

            <div className="cart-drawer">
                <div className="cart-header">
                    <h3>Tu Carrito</h3>
                    <button
                        className="btn-close"
                        onClick={() => setOpenCart(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="cart-body">
                    {arrMerch.length === 0 && arrTicket.length === 0 && (
                        <p className="cart-empty">Tu carrito está vacío.</p>
                    )}

                    {/* Recorre el array de Tienda en el carrito */}

                    {arrMerch.map((elemento, index) => {
                        return (
                            <div key={elemento.cartId ?? index} className="cart-product">
                                <div className="cart-text">
                                    <img
                                        src={elemento.urlImg}
                                        alt=""
                                        className="cart-imgMerch"
                                    />

                                    <div>
                                        <p>{elemento.nombre}</p>
                                        <p className="cart-cantidad">Cantidad: {elemento.cantidad || 1}</p>
                                        <strong className="cart-precio">
                                            {elemento.precio}€
                                        </strong>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeMerch(elemento.cartId)}
                                    className="cart-btn"
                                >
                                    🗑️
                                </button>
                                <hr />
                            </div>
                        );
                    })}

                    {/* Recorre el array de Tickets en el carrito */}

                    {arrTicket.map((elemento, index) => {
                        return (
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
                                <button
                                    onClick={() => removeTicket(elemento.cartId)}
                                    className="cart-btn"
                                >
                                    🗑️
                                </button>
                                <hr />
                            </div>
                        );
                    })}
                </div>
                <div className="cart-footer">
                    <p className="cart-total">Total: {total.toFixed(2)}€</p>
                    <button className="checkout-btn">IR A LA CAJA</button>
                </div>
            </div>
        </>,
        // Insertamos todo dentro del dom no virtual, para que no se cargue desde el componente.
        document.body,
    );
}

export default CarritoModal;
