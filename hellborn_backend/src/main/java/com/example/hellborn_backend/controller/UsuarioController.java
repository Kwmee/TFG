package com.example.hellborn_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hellborn_backend.DTO.CambioRolDTO;
import com.example.hellborn_backend.DTO.LoginRequestDTO;
import com.example.hellborn_backend.DTO.PedidoCrearDTO;
import com.example.hellborn_backend.DTO.PedidoResumenDTO;
import com.example.hellborn_backend.DTO.UsuarioDTO;
import com.example.hellborn_backend.DTO.UsuarioLoginDTO;
import com.example.hellborn_backend.DTO.UsuarioPerfilDTO;
import com.example.hellborn_backend.service.UsuarioService;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioService servicio;

    public UsuarioController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioLoginDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(servicio.login(loginRequestDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioDTO> register(@RequestBody UsuarioDTO usuarioDTO) {
        return ResponseEntity.ok(servicio.register(usuarioDTO));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioLoginDTO>> listarUsuarios(@RequestParam Integer idAdmin) {
        return ResponseEntity.ok(servicio.listarUsuarios(idAdmin));
    }

    @PostMapping("/admin")
    public ResponseEntity<UsuarioLoginDTO> hacerAdmin(@RequestBody CambioRolDTO cambioRolDTO) {
        return ResponseEntity.ok(servicio.hacerAdmin(cambioRolDTO.getIdAdmin(), cambioRolDTO.getIdUsuario()));
    }

    @PostMapping("/admin/quitar")
    public ResponseEntity<UsuarioLoginDTO> quitarAdmin(@RequestBody CambioRolDTO cambioRolDTO) {
        return ResponseEntity.ok(servicio.quitarAdmin(cambioRolDTO.getIdAdmin(), cambioRolDTO.getIdUsuario()));
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioPerfilDTO> obtenerPerfil(@RequestParam Integer idUsuario) {
        return ResponseEntity.ok(servicio.obtenerPerfil(idUsuario));
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioPerfilDTO> actualizarPerfil(
            @RequestParam Integer idUsuario,
            @RequestBody UsuarioPerfilDTO usuarioPerfilDTO
    ) {
        return ResponseEntity.ok(servicio.actualizarPerfil(idUsuario, usuarioPerfilDTO));
    }

    @GetMapping("/pedidos")
    public ResponseEntity<List<PedidoResumenDTO>> listarPedidos(@RequestParam Integer idUsuario) {
        return ResponseEntity.ok(servicio.listarPedidos(idUsuario));
    }

    @PostMapping("/pedidos")
    public ResponseEntity<PedidoResumenDTO> crearPedido(@RequestBody PedidoCrearDTO pedidoCrearDTO) {
        return ResponseEntity.ok(servicio.crearPedido(pedidoCrearDTO));
    }
}
