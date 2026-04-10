import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/NavBars/NavBar";
import Footer from "../../Components/Footer/Footer";
import { HelperLoginContext } from "../../LOGIN/Helpers/HelperLogin";
import {
  getPedidosUsuario,
  getPerfilUsuario,
  putPerfilUsuario,
} from "../API/api";

const formularioInicial = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  calle: "",
  numero: "",
  ciudad: "",
  provincia: "",
  codigoPostal: "",
  pais: "",
};

function Usuario() {
  const navigate = useNavigate();
  const { usuarioLogeado, setUsuarioLogeado, cerrarSesion, cargandoLogin } =
    useContext(HelperLoginContext);
  const [perfil, setPerfil] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    if (!usuarioLogeado?.id) {
      setCargandoPerfil(false);
      return;
    }

    async function cargarUsuario() {
      setCargandoPerfil(true);
      setMensajeError("");

      try {
        const [perfilUsuario, pedidosUsuario] = await Promise.all([
          getPerfilUsuario(usuarioLogeado.id),
          getPedidosUsuario(usuarioLogeado.id),
        ]);

        setPerfil(perfilUsuario);
        setPedidos(pedidosUsuario);
        setFormulario({
          nombre: perfilUsuario.nombre ?? "",
          apellido: perfilUsuario.apellido ?? "",
          email: perfilUsuario.email ?? "",
          telefono: perfilUsuario.telefono ?? "",
          calle: perfilUsuario.direccionUsuario?.calle ?? "",
          numero: perfilUsuario.direccionUsuario?.numero ?? "",
          ciudad: perfilUsuario.direccionUsuario?.ciudad ?? "",
          provincia: perfilUsuario.direccionUsuario?.provincia ?? "",
          codigoPostal: perfilUsuario.direccionUsuario?.codigoPostal ?? "",
          pais: perfilUsuario.direccionUsuario?.pais ?? "",
        });
      } catch (error) {
        setMensajeError(
          error.message ?? "No se ha podido cargar la página de usuario."
        );
      } finally {
        setCargandoPerfil(false);
      }
    }

    cargarUsuario();
  }, [usuarioLogeado]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  async function handleGuardarPerfil(event) {
    event.preventDefault();

    if (!usuarioLogeado?.id) {
      return;
    }

    setGuardandoPerfil(true);
    setMensajeExito("");
    setMensajeError("");

    try {
      const perfilActualizado = await putPerfilUsuario(usuarioLogeado.id, {
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        email: formulario.email,
        telefono: formulario.telefono,
        direccionUsuario: {
          calle: formulario.calle,
          numero: formulario.numero,
          ciudad: formulario.ciudad,
          provincia: formulario.provincia,
          codigoPostal: formulario.codigoPostal,
          pais: formulario.pais,
        },
      });

      setPerfil(perfilActualizado);
      setFormulario({
        nombre: perfilActualizado.nombre ?? "",
        apellido: perfilActualizado.apellido ?? "",
        email: perfilActualizado.email ?? "",
        telefono: perfilActualizado.telefono ?? "",
        calle: perfilActualizado.direccionUsuario?.calle ?? "",
        numero: perfilActualizado.direccionUsuario?.numero ?? "",
        ciudad: perfilActualizado.direccionUsuario?.ciudad ?? "",
        provincia: perfilActualizado.direccionUsuario?.provincia ?? "",
        codigoPostal: perfilActualizado.direccionUsuario?.codigoPostal ?? "",
        pais: perfilActualizado.direccionUsuario?.pais ?? "",
      });

      const usuarioActualizado = {
        ...usuarioLogeado,
        nombre: perfilActualizado.nombre,
        apellido: perfilActualizado.apellido,
        email: perfilActualizado.email,
      };

      localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioActualizado));
      setUsuarioLogeado(usuarioActualizado);
      setMensajeExito("Información de contacto guardada correctamente.");
    } catch (error) {
      setMensajeError(
        error.message ?? "No se ha podido guardar la información de contacto."
      );
    } finally {
      setGuardandoPerfil(false);
    }
  }

  async function handleCerrarSesion() {
    await cerrarSesion();
    navigate("/");
  }

  if (cargandoLogin || cargandoPerfil) {
    return (
      <>
        <Navbar />
        <section className="usuario-page">
          <div className="container">
            <div className="usuario-estado">Cargando página de usuario...</div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (!usuarioLogeado) {
    return (
      <>
        <Navbar />
        <section className="usuario-page">
          <div className="container">
            <div className="usuario-estado">
              <h1 className="usuario-titulo">Página de usuario</h1>
              <p>Debes iniciar sesión para ver tus pedidos y tu información.</p>
              <Link className="usuario-boton" to="/LoginModal">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="usuario-page">
        <div className="container usuario-contenido">
          <div className="usuario-cabecera">
            <div>
              <p className="usuario-etiqueta">Área personal</p>
              <h1 className="usuario-titulo">
                {perfil?.nombre || usuarioLogeado.nombreUsuario}
              </h1>
              <p className="usuario-subtitulo">
                Aquí puedes revisar tus pedidos realizados y completar tu
                información de contacto.
              </p>
            </div>

            <button
              type="button"
              className="usuario-boton usuario-boton-secundario"
              onClick={handleCerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>

          {mensajeExito ? (
            <p className="usuario-mensaje usuario-mensaje-exito">
              {mensajeExito}
            </p>
          ) : null}

          {mensajeError ? (
            <p className="usuario-mensaje usuario-mensaje-error">
              {mensajeError}
            </p>
          ) : null}

          <div className="usuario-grid">
            <article className="usuario-panel">
              <div className="usuario-panel-cabecera">
                <h2>Información de contacto</h2>
                <p>Actualiza los datos que faltan o corrige los existentes.</p>
              </div>

              <form className="usuario-formulario" onSubmit={handleGuardarPerfil}>
                <input className="usuario-input" name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={handleChange} />
                <input className="usuario-input" name="apellido" placeholder="Apellidos" value={formulario.apellido} onChange={handleChange} />
                <input className="usuario-input" name="email" placeholder="Correo electrónico" value={formulario.email} onChange={handleChange} />
                <input className="usuario-input" name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={handleChange} />
                <input className="usuario-input" name="calle" placeholder="Calle" value={formulario.calle} onChange={handleChange} />
                <input className="usuario-input" name="numero" placeholder="Número" value={formulario.numero} onChange={handleChange} />
                <input className="usuario-input" name="ciudad" placeholder="Ciudad" value={formulario.ciudad} onChange={handleChange} />
                <input className="usuario-input" name="provincia" placeholder="Provincia" value={formulario.provincia} onChange={handleChange} />
                <input className="usuario-input" name="codigoPostal" placeholder="Código postal" value={formulario.codigoPostal} onChange={handleChange} />
                <input className="usuario-input" name="pais" placeholder="País" value={formulario.pais} onChange={handleChange} />

                <button type="submit" className="usuario-boton" disabled={guardandoPerfil}>
                  {guardandoPerfil ? "Guardando..." : "Guardar información"}
                </button>
              </form>
            </article>

            <article className="usuario-panel">
              <div className="usuario-panel-cabecera">
                <h2>Pedidos realizados</h2>
                <p>Tus compras finalizadas aparecerán aquí automáticamente.</p>
              </div>

              {pedidos.length === 0 ? (
                <div className="usuario-pedidos-vacio">
                  Todavía no has realizado ningún pedido.
                </div>
              ) : (
                <div className="usuario-pedidos-lista">
                  {pedidos.map((pedido) => (
                    <div className="usuario-pedido" key={pedido.id}>
                      <div className="usuario-pedido-cabecera">
                        <div>
                          <p className="usuario-pedido-fecha">
                            Pedido del {pedido.fechaPedido}
                          </p>
                          <p className="usuario-pedido-estado">
                            Estado: {pedido.estado}
                          </p>
                        </div>
                        <strong className="usuario-pedido-total">
                          {Number(pedido.total || 0).toFixed(2)}€
                        </strong>
                      </div>

                      <div className="usuario-pedido-lineas">
                        {pedido.lineas?.map((linea, indice) => (
                          <div
                            className="usuario-pedido-linea"
                            key={`${pedido.id}-${linea.tipo}-${indice}`}
                          >
                            <div>
                              <p className="usuario-linea-nombre">
                                {linea.nombre}
                              </p>
                              <p className="usuario-linea-meta">
                                {linea.tipo === "TICKET"
                                  ? "Entrada"
                                  : "Merchandising"}{" "}
                                · Cantidad: {linea.cantidad}
                              </p>
                            </div>
                            <strong className="usuario-linea-precio">
                              {Number(linea.subtotal || 0).toFixed(2)}€
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Usuario;
