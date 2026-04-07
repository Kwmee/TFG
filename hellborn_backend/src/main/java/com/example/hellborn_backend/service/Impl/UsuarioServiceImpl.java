package com.example.hellborn_backend.service.Impl;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.hellborn_backend.DTO.LoginRequestDTO;
import com.example.hellborn_backend.DTO.UsuarioLoginDTO;
import com.example.hellborn_backend.entity.Usuario;
import com.example.hellborn_backend.repository.UsuarioRepository;
import com.example.hellborn_backend.service.UsuarioService;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
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
}
