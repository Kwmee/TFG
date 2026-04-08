package com.example.hellborn_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.hellborn_backend.DTO.MerchandisingDTO;
import com.example.hellborn_backend.service.MerchandisingService;

@CrossOrigin(origins = "https://tfg-production-5282.up.railway.app")
@RestController
@RequestMapping("/merchandising") 
public class MerchandisingController {

    private MerchandisingService service;

    public MerchandisingController(MerchandisingService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public ResponseEntity<List<MerchandisingDTO>> getMerch() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{tipo}")
    public ResponseEntity<List<MerchandisingDTO>> getMerchTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(service.findByTipo(tipo));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<MerchandisingDTO>> getMerchAdmin(@RequestParam Integer idAdmin) {
        return ResponseEntity.ok(service.findAllAdmin(idAdmin));
    }

    @PostMapping("/admin")
    public ResponseEntity<MerchandisingDTO> crearMerchAdmin(
            @RequestParam Integer idAdmin,
            @RequestBody MerchandisingDTO merchandisingDTO
    ) {
        return ResponseEntity.ok(service.crearMerchAdmin(idAdmin, merchandisingDTO));
    }

    @DeleteMapping("/admin/{idMerch}")
    public ResponseEntity<Void> eliminarMerchAdmin(
            @PathVariable Integer idMerch,
            @RequestParam Integer idAdmin
    ) {
        service.eliminarMerchAdmin(idAdmin, idMerch);
        return ResponseEntity.noContent().build();
    }
}
