package org.autoflex.mapper;

import jakarta.enterprise.context.ApplicationScoped;
import org.autoflex.dto.RawMaterialRequestDto;
import org.autoflex.dto.RawMaterialResponseDto;
import org.autoflex.entities.RawMaterialEntity;

@ApplicationScoped
public class RawMaterialMapper {

    public RawMaterialEntity toEntity(RawMaterialRequestDto dto) {
        RawMaterialEntity entity = new RawMaterialEntity();
        entity.setName(dto.name());
        entity.setStockQuantity(dto.stockQuantity());
        return entity;
    }

    public RawMaterialResponseDto toResponse(RawMaterialEntity entity) {
        return new RawMaterialResponseDto(
                entity.getId(),
                entity.getName(),
                entity.getStockQuantity()
        );
    }
}
