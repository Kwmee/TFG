import { createPortal } from "react-dom";
import { useContext } from "react";
import { HelperModalContext } from "./Helper/HelperModal";

function CartToast() {
    const { toast } = useContext(HelperModalContext);

    if (!toast) {
        return null;
    }

    return createPortal(
        <div className="cart-toast" role="status" aria-live="polite">
            <span className="cart-toast-badge">Carrito</span>
            <p className="cart-toast-text">{toast}</p>
        </div>,
        document.body,
    );
}

export default CartToast;
