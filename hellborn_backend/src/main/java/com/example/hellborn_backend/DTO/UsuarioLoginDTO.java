package com.example.hellborn_backend.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UsuarioLoginDTO {

    private Integer id;
    private String nombre;
    private String apellido;
    private String nombreUsuario;
    private String email;
    private String rol;
}
