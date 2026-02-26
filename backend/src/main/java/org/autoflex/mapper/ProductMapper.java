package org.autoflex.mapper;

import jakarta.enterprise.context.ApplicationScoped;
import org.autoflex.dto.ProductRequestDto;
import org.autoflex.dto.ProductResponseDto;
import org.autoflex.entities.ProductEntity;

@ApplicationScoped
public class ProductMapper {

    public ProductEntity toEntity(ProductRequestDto dto) {
        ProductEntity entity = new ProductEntity();
        entity.setName(dto.name());
        entity.setValue(dto.value());
        return entity;
    }

    public ProductResponseDto toResponse(ProductEntity entity) {
        return new ProductResponseDto(
                entity.getId(),
                entity.getName(),
                entity.getValue()
        );
    }
}
