package org.autoflex.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.autoflex.dto.RawMaterialRequestDto;
import org.autoflex.dto.RawMaterialResponseDto;
import org.autoflex.entities.RawMaterialEntity;
import org.autoflex.mapper.RawMaterialMapper;

import java.util.List;

@ApplicationScoped
public class RawMaterialServices {

    @Inject
    RawMaterialMapper mapper;

    @Transactional
    public RawMaterialResponseDto create(RawMaterialRequestDto request) {
        RawMaterialEntity entity = mapper.toEntity(request);
        entity.persist();
        return mapper.toResponse(entity);
    }

    public List<RawMaterialResponseDto> findAll() {
        return RawMaterialEntity.<RawMaterialEntity>listAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public RawMaterialResponseDto findById(String id) {
        RawMaterialEntity entity = RawMaterialEntity.findById(id);
        if (entity == null) {
            throw new NotFoundException("Raw material not found with id: " + id);
        }
        return mapper.toResponse(entity);
    }

    @Transactional
    public RawMaterialResponseDto update(String id, RawMaterialRequestDto request) {
        RawMaterialEntity entity = RawMaterialEntity.findById(id);
        if (entity == null) {
            throw new NotFoundException("Raw material not found with id: " + id);
        }
        entity.setName(request.name());
        entity.setStockQuantity(request.stockQuantity());
        return mapper.toResponse(entity);
    }

    @Transactional
    public void delete(String id) {
        RawMaterialEntity entity = RawMaterialEntity.findById(id);
        if (entity == null) {
            throw new NotFoundException("Raw material not found with id: " + id);
        }
        entity.delete();
    }
}
