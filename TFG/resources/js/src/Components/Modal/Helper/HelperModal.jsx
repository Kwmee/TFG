import { createContext, useState } from "react";

export const HelperModalContext = createContext();

export const HelperModalProvider = ({ children }) => {
    const [openCart, setOpenCart] = useState(false);
    const [arrMerch, setArrMerch] = useState([]);
    const [arrTicket, setArrTicket] = useState([]);
    const [toast, setToast] = useState(null);

    function mostrarToast(mensaje) {
        setToast(mensaje);
        window.clearTimeout(window.__hellbornToastTimer);
        window.__hellbornToastTimer = window.setTimeout(() => {
            setToast(null);
        }, 2200);
    }

    const addMerch = (producto) => {
        setArrMerch((prev) => {
            const cartId = `merch-${producto.id}`;
            const existente = prev.find((item) => item.cartId === cartId);

            if (existente) {
                return prev.map((item) =>
                    item.cartId === cartId
                        ? { ...item, cantidad: (item.cantidad || 1) + 1 }
                        : item
                );
            }

            return [...prev, { ...producto, cartId, cantidad: 1 }];
        });
        setOpenCart(true);
        mostrarToast(`${producto.nombre} añadido al carrito`);
    };

    const removeMerch = (cartId) => {
        setArrMerch((prev) =>
            prev.flatMap((item) => {
                if (item.cartId !== cartId) {
                    return [item];
                }

                if ((item.cantidad || 1) <= 1) {
                    return [];
                }

                return [{ ...item, cantidad: item.cantidad - 1 }];
            })
        );
    };

    const addTicket = (producto) => {
        setArrTicket((prev) => {
            const cartId = `ticket-${producto.id ?? producto.categoria}`;
            const existente = prev.find((item) => item.cartId === cartId);

            if (existente) {
                return prev.map((item) =>
                    item.cartId === cartId
                        ? { ...item, cantidad: (item.cantidad || 1) + 1 }
                        : item
                );
            }

            return [...prev, { ...producto, cartId, cantidad: 1 }];
        });
        setOpenCart(true);
        mostrarToast(`${producto.categoria} añadido al carrito`);
    };

    const removeTicket = (cartId) => {
        setArrTicket((prev) =>
            prev.flatMap((item) => {
                if (item.cartId !== cartId) {
                    return [item];
                }

                if ((item.cantidad || 1) <= 1) {
                    return [];
                }

                return [{ ...item, cantidad: item.cantidad - 1 }];
            })
        );
    };

    const vaciarCarrito = () => {
        setArrMerch([]);
        setArrTicket([]);
    };

    return (
        <HelperModalContext.Provider
            value={{ openCart, setOpenCart, arrMerch, addMerch, removeMerch, arrTicket, addTicket, removeTicket, vaciarCarrito, toast }}
        >
            {children}
        </HelperModalContext.Provider>
    );
};
