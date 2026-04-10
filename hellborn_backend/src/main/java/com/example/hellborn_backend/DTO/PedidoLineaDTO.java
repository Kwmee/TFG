package com.example.hellborn_backend.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class PedidoLineaDTO {

    private String tipo;
    private Integer idReferencia;
    private String nombre;
    private Integer cantidad;
    private Float precioUnitario;
    private Float subtotal;
    private String urlImg;
}
