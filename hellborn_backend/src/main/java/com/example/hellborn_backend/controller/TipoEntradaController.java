package com.example.hellborn_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hellborn_backend.DTO.TipoEntradaDTO;
import com.example.hellborn_backend.service.TipoEntradaService;

@RestController
@RequestMapping("/ticket")

public class TipoEntradaController {

    private final TipoEntradaService servicio;

    public TipoEntradaController(TipoEntradaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<TipoEntradaDTO>> getTickets() {
        return ResponseEntity.ok(servicio.findAll());
    }
}
