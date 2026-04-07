package com.example.hellborn_backend.service;

import com.example.hellborn_backend.DTO.LoginRequestDTO;
import com.example.hellborn_backend.DTO.UsuarioDTO;
import com.example.hellborn_backend.DTO.UsuarioLoginDTO;
import java.util.List;

public interface UsuarioService {

    UsuarioLoginDTO login(LoginRequestDTO loginRequestDTO);

    UsuarioDTO register(UsuarioDTO usuarioDTO);

    List<UsuarioLoginDTO> listarUsuarios(Integer idAdmin);

    UsuarioLoginDTO hacerAdmin(Integer idAdmin, Integer idUsuario);

    UsuarioLoginDTO quitarAdmin(Integer idAdmin, Integer idUsuario);
}
