import React, { useContext, useState } from 'react'
import "./modal.css"
import { Link, useNavigate } from "react-router-dom";
import { HelperLoginContext } from '../../LOGIN/Helpers/HelperLogin';
function LoginModal() {
  const navigate = useNavigate();
  const { iniciarSesion, erroresLogin, setErroresLogin } = useContext(HelperLoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  async function enviarLogin(e) {
    e.preventDefault();

    const respuesta = await iniciarSesion({
      email,
      password,
    });

    if (respuesta.ok) {
      setMensajeError("");
      navigate("/");
      return;
    }

    setMensajeError(respuesta.mensaje);
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal">
          <h2 className="modal-title">INICIAR SESIÓN</h2>

          <form
            className="modal-form"
            onSubmit={enviarLogin}
          >
            <input
              type="email"
              placeholder="Email"
              className="modal-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErroresLogin({});
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
                setErroresLogin({});
                setMensajeError("");
              }}
            />

            {erroresLogin.email && (
              <p className="modal-footer">{erroresLogin.email[0]}</p>
            )}

            {erroresLogin.password && (
              <p className="modal-footer">{erroresLogin.password[0]}</p>
            )}

            {mensajeError && (
              <p className="modal-footer">{mensajeError}</p>
            )}

            <button className="modal-button">
              ACCEDER
            </button>
          </form>

          <p className="modal-footer">
            ¿No tienes cuenta? <Link  className="modal-button" to="/register">Regístrate</Link>
            <Link className="modal-button" to="/"> Volver</Link>
          </p>
        </div>
      </div>

    </>
  )
}

export default LoginModal
