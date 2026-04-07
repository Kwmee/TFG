import { Link } from "react-router-dom";

export default function RegisterModal() {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2 className="modal-title">CREAR CUENTA</h2>

                <form className="modal-form">
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        className="modal-input"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="modal-input"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="modal-input"
                    />

                    <input
                        type="password"
                        placeholder="Repite la contraseña"
                        className="modal-input"
                    />

                    <button className="modal-button">
                        REGISTRARSE
                    </button>
                </form>

                <p className="modal-footer">
                    ¿Ya tienes cuenta? <Link className="modal-button" to="/LoginModal">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}
