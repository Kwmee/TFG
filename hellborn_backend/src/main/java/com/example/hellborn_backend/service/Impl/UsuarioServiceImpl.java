package com.example.hellborn_backend.service.Impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.hellborn_backend.DTO.LoginRequestDTO;
import com.example.hellborn_backend.DTO.UsuarioDTO;
import com.example.hellborn_backend.DTO.UsuarioLoginDTO;
import com.example.hellborn_backend.entity.Usuario;
import com.example.hellborn_backend.repository.UsuarioRepository;
import com.example.hellborn_backend.service.UsuarioService;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class UsuarioServiceImpl implements UsuarioService{

    private final UsuarioRepository repository;

    public UsuarioServiceImpl(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public UsuarioLoginDTO login(LoginRequestDTO loginRequestDTO) {
        if (loginRequestDTO.getEmail() == null || loginRequestDTO.getEmail().isBlank()
                || loginRequestDTO.getPassword() == null || loginRequestDTO.getPassword().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Email y password son obligatorios.");
        }

        Usuario usuario = repository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Credenciales incorrectas."));

        if (!usuario.getPassword().equals(loginRequestDTO.getPassword())) {
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
        usuario.setPassword(usuarioDTO.getPassword());
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
}
