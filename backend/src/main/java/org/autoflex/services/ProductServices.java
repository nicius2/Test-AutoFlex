package org.autoflex.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.autoflex.dto.ProductRequestDto;
import org.autoflex.dto.ProductResponseDto;
import org.autoflex.entities.ProductEntity;
import org.autoflex.mapper.ProductMapper;

@ApplicationScoped
public class ProductServices {

    @Inject
    ProductMapper mapper;

    @Transactional
    public ProductResponseDto create(ProductRequestDto request) {
        ProductEntity entity = mapper.toEntity(request);

        entity.persist(); // Active Record

        return mapper.toResponse(entity);
    }
}
