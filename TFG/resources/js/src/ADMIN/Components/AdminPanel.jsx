import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../../Components/NavBars/NavBar";
import Footer from "../../Components/Footer/Footer";
import { deleteConcierto, getConciertosAdmin, postCrearConcierto } from "../API/api";
import { deleteMerch, getMerchAdmin, postCrearMerch } from "../API/apiMerch";
import { getUsuarios, postHacerAdmin, postQuitarAdmin } from "../../LOGIN/API/api";
import "./admin.css";

function AdminPanel() {
  const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado") || "null");
  const [seccionActiva, setSeccionActiva] = useState("eventos");
  const [conciertos, setConciertos] = useState([]);
  const [merch, setMerch] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [paginaConciertos, setPaginaConciertos] = useState(1);
  const [paginaMerch, setPaginaMerch] = useState(1);
  const [formularioConcierto, setFormularioConcierto] = useState({
    nombre: "",
    ciudad: "",
    fechaInicio: "",
    tipoEvento: "",
    idFestival: "",
    url_img: "",
  });
  const [formularioMerch, setFormularioMerch] = useState({
    nombre: "",
    tipo: "",
    precio: "",
    stock: "",
    urlImg: "",
  });

  // Si no hay un admin logeado no dejamos entrar al panel.
  if (!usuarioLogeado || usuarioLogeado.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  async function cargarDatosAdmin() {
    setError("");

    const [resultadoConciertos, resultadoMerch, resultadoUsuarios] = await Promise.allSettled([
      getConciertosAdmin(usuarioLogeado.id, usuarioLogeado.rol),
      getMerchAdmin(usuarioLogeado.id),
      getUsuarios(usuarioLogeado.id),
    ]);

    if (resultadoConciertos.status === "fulfilled") {
      setConciertos(resultadoConciertos.value);
      setPaginaConciertos(1);
    } else {
      setConciertos([]);
    }

    if (resultadoMerch.status === "fulfilled") {
      setMerch(resultadoMerch.value);
      setPaginaMerch(1);
    } else {
      setMerch([]);
    }

    if (resultadoUsuarios.status === "fulfilled") {
      setUsuarios(resultadoUsuarios.value);
    } else {
      setUsuarios([]);
    }

    const totalErrores = [resultadoConciertos, resultadoMerch, resultadoUsuarios].filter(
      (resultado) => resultado.status === "rejected"
    ).length;

    if (totalErrores === 3) {
      setError("No se pudieron cargar los datos del panel.");
      return;
    }

    if (resultadoConciertos.status === "rejected") {
      setError(resultadoConciertos.reason?.message ?? "No se pudieron cargar los conciertos.");
    }

    if (resultadoMerch.status === "rejected") {
      setError(resultadoMerch.reason?.message ?? "No se pudo cargar el merchandising.");
    }

    if (resultadoUsuarios.status === "rejected") {
      setError(resultadoUsuarios.reason?.message ?? "No se pudieron cargar los usuarios.");
    }
  }

  useEffect(() => {
    cargarDatosAdmin();
  }, []);

  function actualizarFormulario(e) {
    const { name, value } = e.target;

    setFormularioConcierto((previo) => ({
      ...previo,
      [name]: value,
    }));
  }

  function actualizarFormularioMerch(e) {
    const { name, value } = e.target;

    setFormularioMerch((previo) => ({
      ...previo,
      [name]: value,
    }));
  }

  async function crearConcierto(e) {
    e.preventDefault();

    try {
      setMensaje("");
      setError("");

      await postCrearConcierto({
        ...formularioConcierto,
        idAdmin: usuarioLogeado.id,
        rolAdmin: usuarioLogeado.rol,
        idFestival: formularioConcierto.idFestival ? Number(formularioConcierto.idFestival) : null,
      });

      setFormularioConcierto({
        nombre: "",
        ciudad: "",
        fechaInicio: "",
        tipoEvento: "",
        idFestival: "",
        url_img: "",
      });

      setMensaje("Concierto añadido correctamente.");
      cargarDatosAdmin();
    } catch (errorPeticion) {
      setError(errorPeticion.message ?? "No se pudo añadir el concierto.");
    }
  }

  async function eliminarConcierto(idConcierto) {
    try {
      setMensaje("");
      setError("");
      await deleteConcierto(idConcierto, usuarioLogeado.id, usuarioLogeado.rol);
      setMensaje("Concierto eliminado correctamente.");
      cargarDatosAdmin();
    } catch (errorPeticion) {
      setError(errorPeticion.message ?? "No se pudo eliminar el concierto.");
    }
  }

  async function convertirEnAdmin(idUsuario) {
    try {
      setMensaje("");
      setError("");

      await postHacerAdmin({
        idAdmin: usuarioLogeado.id,
        idUsuario,
      });

      setMensaje("Usuario actualizado a administrador.");
      cargarDatosAdmin();
    } catch (errorPeticion) {
      setError(errorPeticion.message ?? "No se pudo cambiar el rol del usuario.");
    }
  }

  async function quitarAdmin(idUsuario) {
    try {
      setMensaje("");
      setError("");

      await postQuitarAdmin({
        idAdmin: usuarioLogeado.id,
        idUsuario,
      });

      setMensaje("Rol de administrador quitado correctamente.");
      cargarDatosAdmin();
    } catch (errorPeticion) {
      setError(errorPeticion.message ?? "No se pudo quitar el rol de administrador.");
    }
  }

  async function crearMerch(e) {
    e.preventDefault();

    try {
      setMensaje("");
      setError("");

      await postCrearMerch(usuarioLogeado.id, {
        nombre: formularioMerch.nombre,
        tipo: formularioMerch.tipo,
        precio: Number(formularioMerch.precio),
        stock: Number(formularioMerch.stock),
        urlImg: formularioMerch.urlImg,
      });

      setFormularioMerch({
        nombre: "",
        tipo: "",
        precio: "",
        stock: "",
        urlImg: "",
      });

      setMensaje("Merch añadido correctamente.");
      cargarDatosAdmin();
    } catch (errorPeticion) {
      setError(errorPeticion.message ?? "No se pudo añadir el merch.");
    }
  }

  async function eliminarMerch(idMerch) {
    try {
      setMensaje("");
      setError("");
      await deleteMerch(usuarioLogeado.id, idMerch);
      setMensaje("Merch eliminado correctamente.");
      cargarDatosAdmin();
    } catch (errorPeticion) {
      setError(errorPeticion.message ?? "No se pudo eliminar el merch.");
    }
  }

  const conciertosPorPagina = 4;
  const totalPaginasConciertos = Math.max(1, Math.ceil(conciertos.length / conciertosPorPagina));
  const indiceInicioConciertos = (paginaConciertos - 1) * conciertosPorPagina;
  const conciertosPaginados = conciertos.slice(
    indiceInicioConciertos,
    indiceInicioConciertos + conciertosPorPagina
  );
  const merchPorPagina = 4;
  const totalPaginasMerch = Math.max(1, Math.ceil(merch.length / merchPorPagina));
  const indiceInicioMerch = (paginaMerch - 1) * merchPorPagina;
  const merchPaginado = merch.slice(indiceInicioMerch, indiceInicioMerch + merchPorPagina);

  return (
    <>
      <Navbar />

      <section className="admin-seccion">
        <div className="admin-contenedor">
          <h1 className="admin-titulo">Panel de administración</h1>
          <p className="admin-subtitulo">Gestiona conciertos y usuarios del festival.</p>

          {mensaje && <p className="admin-mensaje-exito">{mensaje}</p>}
          {error && <p className="admin-mensaje-error">{error}</p>}

          <div className="admin-menu">
            <button className={`admin-menu-boton ${seccionActiva === "eventos" ? "admin-menu-boton-activo" : ""}`} type="button" onClick={() => setSeccionActiva("eventos")}>Eventos</button>
            <button className={`admin-menu-boton ${seccionActiva === "merch" ? "admin-menu-boton-activo" : ""}`} type="button" onClick={() => setSeccionActiva("merch")}>Merch</button>
            <button className={`admin-menu-boton ${seccionActiva === "usuarios" ? "admin-menu-boton-activo" : ""}`} type="button" onClick={() => setSeccionActiva("usuarios")}>Usuarios</button>
          </div>

          {seccionActiva === "eventos" && (
          <div className="admin-grid">
            <div className="admin-bloque admin-bloque-formulario">
              <h2 className="admin-bloque-titulo">Añadir concierto</h2>

              <form className="admin-formulario" onSubmit={crearConcierto}>
                <input className="admin-input" name="nombre" placeholder="Nombre" value={formularioConcierto.nombre} onChange={actualizarFormulario} />
                <input className="admin-input" name="ciudad" placeholder="Ciudad" value={formularioConcierto.ciudad} onChange={actualizarFormulario} />
                <input className="admin-input" name="fechaInicio" type="date" value={formularioConcierto.fechaInicio} onChange={actualizarFormulario} />
                <input className="admin-input" name="tipoEvento" placeholder="Tipo de evento" value={formularioConcierto.tipoEvento} onChange={actualizarFormulario} />
                <input className="admin-input" name="idFestival" placeholder="Id del festival" value={formularioConcierto.idFestival} onChange={actualizarFormulario} />
                <input className="admin-input" name="url_img" placeholder="URL de la imagen" value={formularioConcierto.url_img} onChange={actualizarFormulario} />
                <button className="admin-boton" type="submit">Guardar concierto</button>
              </form>
            </div>

            <div className="admin-bloque admin-bloque-conciertos">
              <h2 className="admin-bloque-titulo">Conciertos</h2>

              <div className="admin-lista">
                {conciertosPaginados.map((concierto) => (
                  <div className="admin-item" key={concierto.id}>
                    <div>
                      <p className="admin-item-titulo">{concierto.nombre}</p>
                      <p className="admin-item-texto">{concierto.ciudad} | {concierto.fechaInicio}</p>
                    </div>
                    <button className="admin-boton admin-boton-secundario" onClick={() => eliminarConcierto(concierto.id)}>
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {conciertos.length > conciertosPorPagina && (
                <div className="admin-paginacion">
                  <button
                    className="admin-boton admin-boton-paginacion"
                    type="button"
                    disabled={paginaConciertos === 1}
                    onClick={() => setPaginaConciertos(paginaConciertos - 1)}
                  >
                    Anterior
                  </button>

                  <span className="admin-paginacion-texto">
                    Página {paginaConciertos} de {totalPaginasConciertos}
                  </span>

                  <button
                    className="admin-boton admin-boton-paginacion"
                    type="button"
                    disabled={paginaConciertos === totalPaginasConciertos}
                    onClick={() => setPaginaConciertos(paginaConciertos + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>

          </div>
          )}

          {seccionActiva === "merch" && (
          <div className="admin-grid">
            <div className="admin-bloque admin-bloque-formulario">
              <h2 className="admin-bloque-titulo">Añadir merch</h2>

              <form className="admin-formulario" onSubmit={crearMerch}>
                <input className="admin-input" name="nombre" placeholder="Nombre" value={formularioMerch.nombre} onChange={actualizarFormularioMerch} />
                <input className="admin-input" name="tipo" placeholder="Tipo" value={formularioMerch.tipo} onChange={actualizarFormularioMerch} />
                <input className="admin-input" name="precio" placeholder="Precio" value={formularioMerch.precio} onChange={actualizarFormularioMerch} />
                <input className="admin-input" name="stock" placeholder="Stock" value={formularioMerch.stock} onChange={actualizarFormularioMerch} />
                <input className="admin-input" name="urlImg" placeholder="URL de la imagen" value={formularioMerch.urlImg} onChange={actualizarFormularioMerch} />
                <button className="admin-boton" type="submit">Guardar merch</button>
              </form>
            </div>

            <div className="admin-bloque admin-bloque-conciertos">
              <h2 className="admin-bloque-titulo">Merchandising</h2>

              <div className="admin-lista">
                {merchPaginado.map((elemento) => (
                  <div className="admin-item" key={elemento.id}>
                    <div>
                      <p className="admin-item-titulo">{elemento.nombre}</p>
                      <p className="admin-item-texto">{elemento.tipo} | {elemento.precio} € | Stock: {elemento.stock}</p>
                    </div>
                    <button className="admin-boton admin-boton-secundario" onClick={() => eliminarMerch(elemento.id)}>
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {merch.length > merchPorPagina && (
                <div className="admin-paginacion">
                  <button className="admin-boton admin-boton-paginacion" type="button" disabled={paginaMerch === 1} onClick={() => setPaginaMerch(paginaMerch - 1)}>
                    Anterior
                  </button>
                  <span className="admin-paginacion-texto">Página {paginaMerch} de {totalPaginasMerch}</span>
                  <button className="admin-boton admin-boton-paginacion" type="button" disabled={paginaMerch === totalPaginasMerch} onClick={() => setPaginaMerch(paginaMerch + 1)}>
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          </div>
          )}

          {seccionActiva === "usuarios" && (
          <div className="admin-grid admin-grid-usuarios">
            <div className="admin-bloque admin-bloque-completo">
              <h2 className="admin-bloque-titulo">Usuarios</h2>

              <div className="admin-lista">
                {usuarios.map((usuario) => (
                  <div className="admin-item" key={usuario.id}>
                    <div>
                      <p className="admin-item-titulo">{usuario.nombreUsuario}</p>
                      <p className="admin-item-texto">{usuario.email} | Rol: {usuario.rol}</p>
                    </div>

                    {usuario.rol === "ADMIN" ? (
                      usuario.id === usuarioLogeado.id ? (
                        <span className="admin-estado">Tu cuenta admin</span>
                      ) : (
                        <button className="admin-boton admin-boton-secundario" onClick={() => quitarAdmin(usuario.id)}>
                          Quitar admin
                        </button>
                      )
                    ) : (
                      <button className="admin-boton" onClick={() => convertirEnAdmin(usuario.id)}>
                        Hacer admin
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AdminPanel;
