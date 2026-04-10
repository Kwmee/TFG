package com.example.hellborn_backend.DTO;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class PedidoCrearDTO {

    private Integer idUsuario;
    private DireccionUsuarioDTO direccionUsuario;
    private List<PedidoCrearLineaDTO> lineas;
}
