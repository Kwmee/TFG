import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HelperLoginContext } from "../../LOGIN/Helpers/HelperLogin";

export default function RegisterModal() {
    const navigate = useNavigate();
    const {
        registrarSesion,
        erroresRegister,
        setErroresRegister,
    } = useContext(HelperLoginContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repetirPassword, setRepetirPassword] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    async function enviarRegister(e) {
        e.preventDefault();

        const respuesta = await registrarSesion({
            name,
            email,
            password,
            password_confirmation: repetirPassword,
        });

        if (respuesta.ok) {
            setMensajeError("");
            navigate("/");
            return;
        }

        setMensajeError(respuesta.mensaje);
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2 className="modal-title">CREAR CUENTA</h2>

                <form className="modal-form" onSubmit={enviarRegister}>
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        className="modal-input"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErroresRegister({});
                            setMensajeError("");
                        }}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="modal-input"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErroresRegister({});
                            setMensajeError("");
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="modal-input"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErroresRegister({});
                            setMensajeError("");
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Repite la contraseña"
                        className="modal-input"
                        value={repetirPassword}
                        onChange={(e) => {
                            setRepetirPassword(e.target.value);
                            setErroresRegister({});
                            setMensajeError("");
                        }}
                    />

                    {erroresRegister.name && (
                        <p className="modal-footer">{erroresRegister.name[0]}</p>
                    )}

                    {erroresRegister.email && (
                        <p className="modal-footer">{erroresRegister.email[0]}</p>
                    )}

                    {erroresRegister.password && (
                        <p className="modal-footer">{erroresRegister.password[0]}</p>
                    )}

                    {mensajeError && (
                        <p className="modal-footer">{mensajeError}</p>
                    )}

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
