package com.example.hellborn_backend.service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.hellborn_backend.DTO.MerchandisingDTO;
import com.example.hellborn_backend.entity.Merchandising;
import com.example.hellborn_backend.entity.Usuario;
import com.example.hellborn_backend.mapper.MerchandisingMapper;
import com.example.hellborn_backend.repository.MerchandisingRepository;
import com.example.hellborn_backend.repository.UsuarioRepository;
import com.example.hellborn_backend.service.MerchandisingService;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;

@Service

public class MerchandisingServiceImpl implements MerchandisingService {

    private MerchandisingRepository repository;
    private MerchandisingMapper mapper;
    private UsuarioRepository usuarioRepository;

    public MerchandisingServiceImpl(
            MerchandisingRepository repository,
            MerchandisingMapper mapper,
            UsuarioRepository usuarioRepository
    ) {
        this.mapper = mapper;
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<MerchandisingDTO> findAll() {
        return repository.findAll().stream().map(mapper::toDTO).toList();
    }

    @Override
    public List<MerchandisingDTO> findByTipo(String tipo) {
        return repository.findByTipo(tipo).stream().map(mapper::toDTO).toList();
    }

    // Comprueba que la accion la ejecuta un administrador.
    private void comprobarAdmin(Integer idAdmin) {
        if (idAdmin == null) {
            throw new ResponseStatusException(FORBIDDEN, "No tienes permisos de administrador.");
        }

        Usuario usuario = usuarioRepository.findById(idAdmin)
                .orElseThrow(() -> new ResponseStatusException(FORBIDDEN, "No tienes permisos de administrador."));

        if (!"ADMIN".equals(usuario.getRol())) {
            throw new ResponseStatusException(FORBIDDEN, "No tienes permisos de administrador.");
        }
    }

    @Override
    public List<MerchandisingDTO> findAllAdmin(Integer idAdmin) {
        comprobarAdmin(idAdmin);
        return findAll();
    }

    @Override
    public MerchandisingDTO crearMerchAdmin(Integer idAdmin, MerchandisingDTO merchandisingDTO) {
        comprobarAdmin(idAdmin);

        if (merchandisingDTO.getNombre() == null || merchandisingDTO.getNombre().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "El nombre es obligatorio.");
        }

        if (merchandisingDTO.getTipo() == null || merchandisingDTO.getTipo().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "El tipo es obligatorio.");
        }

        if (merchandisingDTO.getPrecio() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "El precio es obligatorio.");
        }

        if (merchandisingDTO.getStock() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "El stock es obligatorio.");
        }

        if (merchandisingDTO.getUrlImg() == null || merchandisingDTO.getUrlImg().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "La imagen es obligatoria.");
        }

        Merchandising merchandising = mapper.toEntity(merchandisingDTO);
        Merchandising merchandisingGuardado = repository.save(merchandising);
        return mapper.toDTO(merchandisingGuardado);
    }

    @Override
    public void eliminarMerchAdmin(Integer idAdmin, Integer idMerch) {
        comprobarAdmin(idAdmin);

        if (idMerch == null) {
            throw new ResponseStatusException(BAD_REQUEST, "El id del merch es obligatorio.");
        }

        repository.deleteById(idMerch);
    }

}
