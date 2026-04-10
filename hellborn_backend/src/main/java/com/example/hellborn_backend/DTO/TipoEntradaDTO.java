package com.example.hellborn_backend.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TipoEntradaDTO {

    private Integer id;
    private String categoria;
    private Float precio;
    private String descripcion;
}
