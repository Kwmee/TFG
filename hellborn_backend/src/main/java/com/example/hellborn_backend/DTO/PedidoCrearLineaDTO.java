package com.example.hellborn_backend.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class PedidoCrearLineaDTO {

    private String tipo;
    private Integer idReferencia;
    private Integer cantidad;
}
