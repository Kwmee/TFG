import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./modal.css";
import { HelperLoginContext } from "../../LOGIN/Helpers/HelperLogin";

export default function RegisterModal() {
    const navigate = useNavigate();
    const { registrarUsuario, erroresRegister, setErroresRegister } = useContext(HelperLoginContext);
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");

    async function enviarRegistro(e) {
        e.preventDefault();
        setMensajeError("");
        setMensajeExito("");
        setErroresRegister({});

        if (!nombreUsuario.trim() || !email.trim() || !password || !passwordRepeat) {
            setMensajeError("Completa todos los campos.");
            return;
        }

        if (password !== passwordRepeat) {
            setMensajeError("Las contraseñas no coinciden.");
            return;
        }

        const respuesta = await registrarUsuario({
            nombreUsuario: nombreUsuario.trim(),
            nombre: nombreUsuario.trim(),
            email: email.trim(),
            password,
        });

        if (!respuesta.ok) {
            setMensajeError(respuesta.mensaje);
            return;
        }

        setMensajeExito("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
        setNombreUsuario("");
        setEmail("");
        setPassword("");
        setPasswordRepeat("");
        window.setTimeout(() => navigate("/LoginModal"), 1200);
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2 className="modal-title">CREAR CUENTA</h2>

                <form className="modal-form" onSubmit={enviarRegistro}>
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        className="modal-input"
                        value={nombreUsuario}
                        onChange={(e) => {
                            setNombreUsuario(e.target.value);
                            setErroresRegister({});
                            setMensajeError("");
                            setMensajeExito("");
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
                            setMensajeExito("");
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
                            setMensajeExito("");
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Repite la contraseña"
                        className="modal-input"
                        value={passwordRepeat}
                        onChange={(e) => {
                            setPasswordRepeat(e.target.value);
                            setErroresRegister({});
                            setMensajeError("");
                            setMensajeExito("");
                        }}
                    />

                    {erroresRegister.nombreUsuario && (
                        <p className="modal-footer">{erroresRegister.nombreUsuario[0]}</p>
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

                    {mensajeExito && (
                        <p className="modal-footer">{mensajeExito}</p>
                    )}

                    <button className="modal-button" type="submit">
                        REGISTRARSE
                    </button>
                </form>

                <p className="modal-footer">
                    ¿Ya tienes cuenta? <Link className="modal-button" to="/LoginModal">Inicia sesión</Link>
                    <Link className="modal-button" to="/"> Volver</Link>
                </p>
            </div>
        </div>
    );
}
