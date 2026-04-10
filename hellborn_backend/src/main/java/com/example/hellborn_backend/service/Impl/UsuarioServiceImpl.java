package com.example.hellborn_backend.service.Impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.hellborn_backend.DTO.DireccionUsuarioDTO;
import com.example.hellborn_backend.DTO.LoginRequestDTO;
import com.example.hellborn_backend.DTO.PedidoCrearDTO;
import com.example.hellborn_backend.DTO.PedidoCrearLineaDTO;
import com.example.hellborn_backend.DTO.PedidoLineaDTO;
import com.example.hellborn_backend.DTO.PedidoResumenDTO;
import com.example.hellborn_backend.DTO.UsuarioDTO;
import com.example.hellborn_backend.DTO.UsuarioLoginDTO;
import com.example.hellborn_backend.DTO.UsuarioPerfilDTO;
import com.example.hellborn_backend.entity.DireccionUsuario;
import com.example.hellborn_backend.entity.Entrada;
import com.example.hellborn_backend.entity.Merchandising;
import com.example.hellborn_backend.entity.PedidoDetalle;
import com.example.hellborn_backend.entity.PedidoUsuario;
import com.example.hellborn_backend.entity.TipoEntrada;
import com.example.hellborn_backend.entity.Usuario;
import com.example.hellborn_backend.repository.DireccionUsuarioRepository;
import com.example.hellborn_backend.repository.EntradaRepository;
import com.example.hellborn_backend.repository.MerchandisingRepository;
import com.example.hellborn_backend.repository.PedidoDetalleRepository;
import com.example.hellborn_backend.repository.PedidoUsuarioRepository;
import com.example.hellborn_backend.repository.TipoEntradaRepository;
import com.example.hellborn_backend.repository.UsuarioRepository;
import com.example.hellborn_backend.service.UsuarioService;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class UsuarioServiceImpl implements UsuarioService{

    private final UsuarioRepository repository;
    private final DireccionUsuarioRepository direccionUsuarioRepository;
    private final PedidoUsuarioRepository pedidoUsuarioRepository;
    private final PedidoDetalleRepository pedidoDetalleRepository;
    private final EntradaRepository entradaRepository;
    private final MerchandisingRepository merchandisingRepository;
    private final TipoEntradaRepository tipoEntradaRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioServiceImpl(
            UsuarioRepository repository,
            DireccionUsuarioRepository direccionUsuarioRepository,
            PedidoUsuarioRepository pedidoUsuarioRepository,
            PedidoDetalleRepository pedidoDetalleRepository,
            EntradaRepository entradaRepository,
            MerchandisingRepository merchandisingRepository,
            TipoEntradaRepository tipoEntradaRepository
    ) {
        this.repository = repository;
        this.direccionUsuarioRepository = direccionUsuarioRepository;
        this.pedidoUsuarioRepository = pedidoUsuarioRepository;
        this.pedidoDetalleRepository = pedidoDetalleRepository;
        this.entradaRepository = entradaRepository;
        this.merchandisingRepository = merchandisingRepository;
        this.tipoEntradaRepository = tipoEntradaRepository;
    }

    @Override
    public UsuarioLoginDTO login(LoginRequestDTO loginRequestDTO) {
        if (loginRequestDTO.getEmail() == null || loginRequestDTO.getEmail().isBlank()
                || loginRequestDTO.getPassword() == null || loginRequestDTO.getPassword().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Email y password son obligatorios.");
        }

        Usuario usuario = repository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Credenciales incorrectas."));

        boolean passwordValida = passwordEncoder.matches(loginRequestDTO.getPassword(), usuario.getPassword());

        if (!passwordValida && usuario.getPassword().equals(loginRequestDTO.getPassword())) {
            usuario.setPassword(passwordEncoder.encode(loginRequestDTO.getPassword()));
            repository.save(usuario);
            passwordValida = true;
        }

        if (!passwordValida) {
            throw new ResponseStatusException(UNAUTHORIZED, "Credenciales incorrectas.");
        }

        UsuarioLoginDTO usuarioLoginDTO = new UsuarioLoginDTO();
        usuarioLoginDTO.setId(usuario.getId());
        usuarioLoginDTO.setNombre(usuario.getNombre());
        usuarioLoginDTO.setApellido(usuario.getApellido());
        usuarioLoginDTO.setNombreUsuario(usuario.getNombreUsuario());
        usuarioLoginDTO.setEmail(usuario.getEmail());
        usuarioLoginDTO.setRol(usuario.getRol());

        return usuarioLoginDTO;
    }

    @Override
    public UsuarioDTO register(UsuarioDTO usuarioDTO) {
        if (usuarioDTO.getNombreUsuario() == null || usuarioDTO.getNombreUsuario().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "El nombre de usuario es obligatorio.");
        }

        if (usuarioDTO.getEmail() == null || usuarioDTO.getEmail().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "El email es obligatorio.");
        }

        if (usuarioDTO.getPassword() == null || usuarioDTO.getPassword().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "La password es obligatoria.");
        }

        if (repository.findByNombreUsuario(usuarioDTO.getNombreUsuario().trim()).isPresent()) {
            throw new ResponseStatusException(CONFLICT, "El nombre de usuario ya existe.");
        }

        if (repository.findByEmail(usuarioDTO.getEmail().trim()).isPresent()) {
            throw new ResponseStatusException(CONFLICT, "El email ya esta registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(usuarioDTO.getNombreUsuario().trim());
        usuario.setNombre(usuarioDTO.getNombre() == null || usuarioDTO.getNombre().isBlank()
                ? usuarioDTO.getNombreUsuario().trim()
                : usuarioDTO.getNombre().trim());
        usuario.setEmail(usuarioDTO.getEmail().trim());
        usuario.setPassword(passwordEncoder.encode(usuarioDTO.getPassword()));
        usuario.setRol(usuarioDTO.getRol() == null || usuarioDTO.getRol().isBlank() ? "USER" : usuarioDTO.getRol().trim());
        usuario.setFechaRegistro(LocalDate.now());

        if (usuarioDTO.getTelefono() != null && !usuarioDTO.getTelefono().isBlank()) {
            try {
                usuario.setTelefono(Integer.valueOf(usuarioDTO.getTelefono().trim()));
            } catch (NumberFormatException exception) {
                throw new ResponseStatusException(BAD_REQUEST, "El telefono debe ser numerico.");
            }
        }

        Usuario usuarioGuardado = repository.save(usuario);

        UsuarioDTO respuesta = new UsuarioDTO();
        respuesta.setNombre(usuarioGuardado.getNombre());
        respuesta.setNombreUsuario(usuarioGuardado.getNombreUsuario());
        respuesta.setEmail(usuarioGuardado.getEmail());
        respuesta.setRol(usuarioGuardado.getRol());
        respuesta.setFechaRegistro(usuarioGuardado.getFechaRegistro());
        if (usuarioGuardado.getTelefono() != null) {
            respuesta.setTelefono(usuarioGuardado.getTelefono().toString());
        }

        return respuesta;
    }

    // Convierte la entidad al DTO que ya usa el login.
    private UsuarioLoginDTO convertirUsuarioLoginDTO(Usuario usuario) {
        UsuarioLoginDTO usuarioLoginDTO = new UsuarioLoginDTO();
        usuarioLoginDTO.setId(usuario.getId());
        usuarioLoginDTO.setNombre(usuario.getNombre());
        usuarioLoginDTO.setApellido(usuario.getApellido());
        usuarioLoginDTO.setNombreUsuario(usuario.getNombreUsuario());
        usuarioLoginDTO.setEmail(usuario.getEmail());
        usuarioLoginDTO.setRol(usuario.getRol());
        return usuarioLoginDTO;
    }

    // Se usa en las acciones del panel para asegurar que quien entra es admin.
    private Usuario obtenerAdmin(Integer idAdmin) {
        if (idAdmin == null) {
            throw new ResponseStatusException(FORBIDDEN, "No tienes permisos de administrador.");
        }

        Usuario admin = repository.findById(idAdmin)
                .orElseThrow(() -> new ResponseStatusException(FORBIDDEN, "No tienes permisos de administrador."));

        if (!"ADMIN".equals(admin.getRol())) {
            throw new ResponseStatusException(FORBIDDEN, "No tienes permisos de administrador.");
        }

        return admin;
    }

    @Override
    public List<UsuarioLoginDTO> listarUsuarios(Integer idAdmin) {
        obtenerAdmin(idAdmin);

        return repository.findAll()
                .stream()
                .map(this::convertirUsuarioLoginDTO)
                .toList();
    }

    @Override
    public UsuarioLoginDTO hacerAdmin(Integer idAdmin, Integer idUsuario) {
        obtenerAdmin(idAdmin);

        if (idUsuario == null) {
            throw new ResponseStatusException(BAD_REQUEST, "El id del usuario es obligatorio.");
        }

        Usuario usuario = repository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "El usuario no existe."));

        usuario.setRol("ADMIN");
        Usuario usuarioGuardado = repository.save(usuario);

        return convertirUsuarioLoginDTO(usuarioGuardado);
    }

    @Override
    public UsuarioLoginDTO quitarAdmin(Integer idAdmin, Integer idUsuario) {
        obtenerAdmin(idAdmin);

        if (idUsuario == null) {
            throw new ResponseStatusException(BAD_REQUEST, "El id del usuario es obligatorio.");
        }

        if (idAdmin.equals(idUsuario)) {
            throw new ResponseStatusException(BAD_REQUEST, "No puedes quitarte el rol de administrador a ti mismo.");
        }

        Usuario usuario = repository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "El usuario no existe."));

        usuario.setRol("USER");
        Usuario usuarioGuardado = repository.save(usuario);

        return convertirUsuarioLoginDTO(usuarioGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioPerfilDTO obtenerPerfil(Integer idUsuario) {
        return convertirUsuarioPerfilDTO(obtenerUsuario(idUsuario));
    }

    @Override
    @Transactional
    public UsuarioPerfilDTO actualizarPerfil(Integer idUsuario, UsuarioPerfilDTO usuarioPerfilDTO) {
        Usuario usuario = obtenerUsuario(idUsuario);

        if (usuarioPerfilDTO.getNombre() != null) {
            String nombre = usuarioPerfilDTO.getNombre().trim();
            usuario.setNombre(nombre.isBlank() ? usuario.getNombreUsuario() : nombre);
        }

        if (usuarioPerfilDTO.getApellido() != null) {
            String apellido = usuarioPerfilDTO.getApellido().trim();
            usuario.setApellido(apellido.isBlank() ? null : apellido);
        }

        if (usuarioPerfilDTO.getEmail() != null) {
            String email = usuarioPerfilDTO.getEmail().trim();
            if (email.isBlank()) {
                throw new ResponseStatusException(BAD_REQUEST, "El email es obligatorio.");
            }

            repository.findByEmail(email)
                    .filter(usuarioExistente -> !usuarioExistente.getId().equals(usuario.getId()))
                    .ifPresent(usuarioExistente -> {
                        throw new ResponseStatusException(CONFLICT, "El email ya esta registrado.");
                    });

            usuario.setEmail(email);
        }

        if (usuarioPerfilDTO.getTelefono() != null) {
            String telefono = usuarioPerfilDTO.getTelefono().trim();
            if (telefono.isBlank()) {
                usuario.setTelefono(null);
            } else {
                try {
                    usuario.setTelefono(Integer.valueOf(telefono));
                } catch (NumberFormatException exception) {
                    throw new ResponseStatusException(BAD_REQUEST, "El telefono debe ser numerico.");
                }
            }
        }

        if (usuarioPerfilDTO.getDireccionUsuario() != null) {
            usuario.setDireccionUsuario(guardarDireccionUsuario(usuario.getDireccionUsuario(), usuarioPerfilDTO.getDireccionUsuario()));
        }

        Usuario usuarioGuardado = repository.save(usuario);
        return convertirUsuarioPerfilDTO(usuarioGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResumenDTO> listarPedidos(Integer idUsuario) {
        obtenerUsuario(idUsuario);

        return pedidoUsuarioRepository.findByUsuarioIdOrderByFechaPedidoDescIdDesc(idUsuario)
                .stream()
                .map(this::convertirPedidoResumenDTO)
                .toList();
    }

    @Override
    @Transactional
    public PedidoResumenDTO crearPedido(PedidoCrearDTO pedidoCrearDTO) {
        if (pedidoCrearDTO.getIdUsuario() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "El id del usuario es obligatorio.");
        }

        if (pedidoCrearDTO.getLineas() == null || pedidoCrearDTO.getLineas().isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "El pedido no puede estar vacio.");
        }

        Usuario usuario = obtenerUsuario(pedidoCrearDTO.getIdUsuario());

        if (pedidoCrearDTO.getDireccionUsuario() != null) {
            usuario.setDireccionUsuario(guardarDireccionUsuario(usuario.getDireccionUsuario(), pedidoCrearDTO.getDireccionUsuario()));
            repository.save(usuario);
        }

        PedidoUsuario pedidoUsuario = new PedidoUsuario();
        pedidoUsuario.setUsuario(usuario);
        pedidoUsuario.setFechaPedido(LocalDate.now());
        pedidoUsuario.setEstado("REALIZADO");
        pedidoUsuario.setTotal(0F);

        PedidoUsuario pedidoGuardado = pedidoUsuarioRepository.save(pedidoUsuario);
        List<PedidoLineaDTO> lineasResumen = new ArrayList<>();
        float total = 0F;

        for (PedidoCrearLineaDTO linea : pedidoCrearDTO.getLineas()) {
            if (linea.getCantidad() == null || linea.getCantidad() <= 0) {
                throw new ResponseStatusException(BAD_REQUEST, "La cantidad del pedido debe ser mayor que cero.");
            }

            if (linea.getIdReferencia() == null) {
                throw new ResponseStatusException(BAD_REQUEST, "El producto o la entrada del pedido no es valido.");
            }

            String tipo = linea.getTipo() == null ? "" : linea.getTipo().trim().toUpperCase();

            if ("MERCH".equals(tipo)) {
                Merchandising merchandising = merchandisingRepository.findById(linea.getIdReferencia())
                        .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "El producto seleccionado no existe."));

                PedidoDetalle pedidoDetalle = new PedidoDetalle();
                pedidoDetalle.setPedido(pedidoGuardado);
                pedidoDetalle.setMerchandising(merchandising);
                pedidoDetalle.setCantidad(linea.getCantidad());
                pedidoDetalle.setPrecioUnitario(merchandising.getPrecio());
                pedidoDetalle.setSubTotal(merchandising.getPrecio() * linea.getCantidad());
                pedidoDetalleRepository.save(pedidoDetalle);

                PedidoLineaDTO pedidoLineaDTO = new PedidoLineaDTO();
                pedidoLineaDTO.setTipo("MERCH");
                pedidoLineaDTO.setIdReferencia(merchandising.getId());
                pedidoLineaDTO.setNombre(merchandising.getNombre());
                pedidoLineaDTO.setCantidad(linea.getCantidad());
                pedidoLineaDTO.setPrecioUnitario(merchandising.getPrecio());
                pedidoLineaDTO.setSubtotal(pedidoDetalle.getSubTotal());
                pedidoLineaDTO.setUrlImg(merchandising.getUrlImg());
                lineasResumen.add(pedidoLineaDTO);

                total += pedidoDetalle.getSubTotal();
                continue;
            }

            if ("TICKET".equals(tipo)) {
                TipoEntrada tipoEntrada = tipoEntradaRepository.findById(linea.getIdReferencia())
                        .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "La entrada seleccionada no existe."));

                Entrada entrada = new Entrada();
                entrada.setPedido(pedidoGuardado);
                entrada.setTipoEntrada(tipoEntrada);
                entrada.setCantidad(linea.getCantidad());
                entrada.setFechaCompra(LocalDate.now());
                entradaRepository.save(entrada);

                Float subtotal = tipoEntrada.getPrecio() * linea.getCantidad();

                PedidoLineaDTO pedidoLineaDTO = new PedidoLineaDTO();
                pedidoLineaDTO.setTipo("TICKET");
                pedidoLineaDTO.setIdReferencia(tipoEntrada.getId());
                pedidoLineaDTO.setNombre(tipoEntrada.getCategoria());
                pedidoLineaDTO.setCantidad(linea.getCantidad());
                pedidoLineaDTO.setPrecioUnitario(tipoEntrada.getPrecio());
                pedidoLineaDTO.setSubtotal(subtotal);
                lineasResumen.add(pedidoLineaDTO);

                total += subtotal;
                continue;
            }

            throw new ResponseStatusException(BAD_REQUEST, "El tipo de linea del pedido no es valido.");
        }

        pedidoGuardado.setTotal(total);
        pedidoUsuarioRepository.save(pedidoGuardado);

        PedidoResumenDTO pedidoResumenDTO = new PedidoResumenDTO();
        pedidoResumenDTO.setId(pedidoGuardado.getId());
        pedidoResumenDTO.setFechaPedido(pedidoGuardado.getFechaPedido());
        pedidoResumenDTO.setEstado(pedidoGuardado.getEstado());
        pedidoResumenDTO.setTotal(total);
        pedidoResumenDTO.setLineas(lineasResumen);
        return pedidoResumenDTO;
    }

    private Usuario obtenerUsuario(Integer idUsuario) {
        if (idUsuario == null) {
            throw new ResponseStatusException(BAD_REQUEST, "El id del usuario es obligatorio.");
        }

        return repository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "El usuario no existe."));
    }

    private UsuarioPerfilDTO convertirUsuarioPerfilDTO(Usuario usuario) {
        UsuarioPerfilDTO usuarioPerfilDTO = new UsuarioPerfilDTO();
        usuarioPerfilDTO.setId(usuario.getId());
        usuarioPerfilDTO.setNombre(usuario.getNombre());
        usuarioPerfilDTO.setApellido(usuario.getApellido());
        usuarioPerfilDTO.setNombreUsuario(usuario.getNombreUsuario());
        usuarioPerfilDTO.setEmail(usuario.getEmail());
        usuarioPerfilDTO.setRol(usuario.getRol());
        usuarioPerfilDTO.setFechaRegistro(usuario.getFechaRegistro());
        if (usuario.getTelefono() != null) {
            usuarioPerfilDTO.setTelefono(usuario.getTelefono().toString());
        }
        usuarioPerfilDTO.setDireccionUsuario(convertirDireccionUsuarioDTO(usuario.getDireccionUsuario()));
        return usuarioPerfilDTO;
    }

    private DireccionUsuarioDTO convertirDireccionUsuarioDTO(DireccionUsuario direccionUsuario) {
        if (direccionUsuario == null) {
            return null;
        }

        DireccionUsuarioDTO direccionUsuarioDTO = new DireccionUsuarioDTO();
        direccionUsuarioDTO.setCalle(direccionUsuario.getCalle());
        if (direccionUsuario.getNumero() != null) {
            direccionUsuarioDTO.setNumero(direccionUsuario.getNumero().toString());
        }
        direccionUsuarioDTO.setCiudad(direccionUsuario.getCiudad());
        direccionUsuarioDTO.setProvincia(direccionUsuario.getProvincia());
        direccionUsuarioDTO.setCodigoPostal(direccionUsuario.getCodigoPostal());
        direccionUsuarioDTO.setPais(direccionUsuario.getPais());
        return direccionUsuarioDTO;
    }

    private DireccionUsuario guardarDireccionUsuario(DireccionUsuario direccionActual, DireccionUsuarioDTO direccionUsuarioDTO) {
        DireccionUsuario direccionUsuario = direccionActual == null ? new DireccionUsuario() : direccionActual;

        direccionUsuario.setCalle(normalizarTexto(direccionUsuarioDTO.getCalle()));
        direccionUsuario.setCiudad(normalizarTexto(direccionUsuarioDTO.getCiudad()));
        direccionUsuario.setProvincia(normalizarTexto(direccionUsuarioDTO.getProvincia()));
        direccionUsuario.setCodigoPostal(normalizarTexto(direccionUsuarioDTO.getCodigoPostal()));
        direccionUsuario.setPais(normalizarTexto(direccionUsuarioDTO.getPais()));

        String numero = normalizarTexto(direccionUsuarioDTO.getNumero());
        if (numero == null) {
            direccionUsuario.setNumero(null);
        } else {
            try {
                direccionUsuario.setNumero(Integer.valueOf(numero));
            } catch (NumberFormatException exception) {
                throw new ResponseStatusException(BAD_REQUEST, "El numero de la direccion debe ser numerico.");
            }
        }

        boolean direccionVacia = direccionUsuario.getCalle() == null
                && direccionUsuario.getNumero() == null
                && direccionUsuario.getCiudad() == null
                && direccionUsuario.getProvincia() == null
                && direccionUsuario.getCodigoPostal() == null
                && direccionUsuario.getPais() == null;

        if (direccionVacia) {
            return null;
        }

        return direccionUsuarioRepository.save(direccionUsuario);
    }

    private PedidoResumenDTO convertirPedidoResumenDTO(PedidoUsuario pedidoUsuario) {
        PedidoResumenDTO pedidoResumenDTO = new PedidoResumenDTO();
        pedidoResumenDTO.setId(pedidoUsuario.getId());
        pedidoResumenDTO.setFechaPedido(pedidoUsuario.getFechaPedido());
        pedidoResumenDTO.setEstado(pedidoUsuario.getEstado());
        pedidoResumenDTO.setTotal(pedidoUsuario.getTotal());

        List<PedidoLineaDTO> lineas = new ArrayList<>();

        for (PedidoDetalle pedidoDetalle : pedidoUsuario.getPedidosDetalle() == null
                ? Collections.emptyList()
                : pedidoUsuario.getPedidosDetalle()) {
            PedidoLineaDTO pedidoLineaDTO = new PedidoLineaDTO();
            pedidoLineaDTO.setTipo("MERCH");
            if (pedidoDetalle.getMerchandising() != null) {
                pedidoLineaDTO.setIdReferencia(pedidoDetalle.getMerchandising().getId());
                pedidoLineaDTO.setNombre(pedidoDetalle.getMerchandising().getNombre());
                pedidoLineaDTO.setUrlImg(pedidoDetalle.getMerchandising().getUrlImg());
            }
            pedidoLineaDTO.setCantidad(pedidoDetalle.getCantidad());
            pedidoLineaDTO.setPrecioUnitario(pedidoDetalle.getPrecioUnitario());
            pedidoLineaDTO.setSubtotal(pedidoDetalle.getSubTotal());
            lineas.add(pedidoLineaDTO);
        }

        for (Entrada entrada : pedidoUsuario.getEntradas() == null
                ? Collections.emptyList()
                : pedidoUsuario.getEntradas()) {
            PedidoLineaDTO pedidoLineaDTO = new PedidoLineaDTO();
            pedidoLineaDTO.setTipo("TICKET");
            if (entrada.getTipoEntrada() != null) {
                pedidoLineaDTO.setIdReferencia(entrada.getTipoEntrada().getId());
                pedidoLineaDTO.setNombre(entrada.getTipoEntrada().getCategoria());
                pedidoLineaDTO.setPrecioUnitario(entrada.getTipoEntrada().getPrecio());
                pedidoLineaDTO.setSubtotal(entrada.getTipoEntrada().getPrecio() * entrada.getCantidad());
            }
            pedidoLineaDTO.setCantidad(entrada.getCantidad());
            lineas.add(pedidoLineaDTO);
        }

        pedidoResumenDTO.setLineas(lineas);
        return pedidoResumenDTO;
    }

    private String normalizarTexto(String valor) {
        if (valor == null) {
            return null;
        }

        String valorNormalizado = valor.trim();
        return valorNormalizado.isBlank() ? null : valorNormalizado;
    }
}
