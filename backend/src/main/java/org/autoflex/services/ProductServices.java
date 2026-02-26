package org.autoflex.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.autoflex.dto.ProductRequestDto;
import org.autoflex.dto.ProductResponseDto;
import org.autoflex.entities.ProductEntity;
import org.autoflex.mapper.ProductMapper;

import java.util.List;

@ApplicationScoped
public class ProductServices {

    @Inject
    ProductMapper mapper;

    @Transactional
    public ProductResponseDto create(ProductRequestDto request) {
        ProductEntity entity = mapper.toEntity(request);
        entity.persist();
        return mapper.toResponse(entity);
    }

    public List<ProductResponseDto> findAll() {
        return ProductEntity.<ProductEntity>listAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public ProductResponseDto findById(String id) {
        ProductEntity entity = ProductEntity.findById(id);
        if (entity == null) {
            throw new NotFoundException("Product not found with id: " + id);
        }
        return mapper.toResponse(entity);
    }

    @Transactional
    public ProductResponseDto update(String id, ProductRequestDto request) {
        ProductEntity entity = ProductEntity.findById(id);
        if (entity == null) {
            throw new NotFoundException("Product not found with id: " + id);
        }
        entity.setName(request.name());
        entity.setValue(request.value());
        return mapper.toResponse(entity);
    }

    @Transactional
    public void delete(String id) {
        ProductEntity entity = ProductEntity.findById(id);
        if (entity == null) {
            throw new NotFoundException("Product not found with id: " + id);
        }
        entity.delete();
    }
}
