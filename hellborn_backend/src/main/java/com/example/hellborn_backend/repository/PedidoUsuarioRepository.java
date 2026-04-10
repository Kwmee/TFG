package com.example.hellborn_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hellborn_backend.entity.PedidoUsuario;

public interface PedidoUsuarioRepository extends JpaRepository<PedidoUsuario, Integer>{

    List<PedidoUsuario> findByUsuarioIdOrderByFechaPedidoDescIdDesc(Integer idUsuario);
}
