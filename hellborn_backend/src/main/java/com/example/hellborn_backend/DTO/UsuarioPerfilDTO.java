package com.example.hellborn_backend.DTO;

import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UsuarioPerfilDTO {

    private Integer id;
    private String nombre;
    private String apellido;
    private String nombreUsuario;
    private String email;
    private String telefono;
    private String rol;
    private LocalDate fechaRegistro;
    private DireccionUsuarioDTO direccionUsuario;
}
