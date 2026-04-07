package com.example.hellborn_backend.service;

import java.util.List;

import com.example.hellborn_backend.DTO.MerchandisingDTO;

public interface MerchandisingService {

    List<MerchandisingDTO> findAll();

    List<MerchandisingDTO> findByTipo(String tipo);

    List<MerchandisingDTO> findAllAdmin(Integer idAdmin);

    MerchandisingDTO crearMerchAdmin(Integer idAdmin, MerchandisingDTO merchandisingDTO);

    void eliminarMerchAdmin(Integer idAdmin, Integer idMerch);

}
