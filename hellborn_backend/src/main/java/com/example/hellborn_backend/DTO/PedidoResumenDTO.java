package com.example.hellborn_backend.DTO;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class PedidoResumenDTO {

    private Integer id;
    private Float total;
    private String estado;
    private LocalDate fechaPedido;
    private List<PedidoLineaDTO> lineas;
}
