package com.example.hellborn_backend.service;

import com.example.hellborn_backend.DTO.LoginRequestDTO;
import com.example.hellborn_backend.DTO.UsuarioDTO;
import com.example.hellborn_backend.DTO.UsuarioLoginDTO;

public interface UsuarioService {

    UsuarioLoginDTO login(LoginRequestDTO loginRequestDTO);

    UsuarioDTO register(UsuarioDTO usuarioDTO);
}
