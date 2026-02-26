package org.autoflex.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.autoflex.dto.ProductMaterialRequestDto;
import org.autoflex.dto.ProductMaterialResponseDto;
import org.autoflex.entities.ProductEntity;
import org.autoflex.entities.ProductMaterialEntity;
import org.autoflex.entities.ProductMaterialId;
import org.autoflex.entities.RawMaterialEntity;

import java.util.List;

@ApplicationScoped
public class ProductMaterialServices {

    /** Associate a raw material to a product (or update the required quantity). */
    @Transactional
    public ProductMaterialResponseDto addMaterial(String productId,
            ProductMaterialRequestDto request) {
        ProductEntity product = ProductEntity.findById(productId);
        if (product == null) {
            throw new NotFoundException("Product not found with id: " + productId);
        }

        RawMaterialEntity rawMaterial = RawMaterialEntity.findById(request.rawMaterialId());
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found with id: " + request.rawMaterialId());
        }

        ProductMaterialId id = new ProductMaterialId(productId, request.rawMaterialId());

        // Upsert: update if already linked, otherwise create
        ProductMaterialEntity link = ProductMaterialEntity.findById(id);
        if (link == null) {
            link = new ProductMaterialEntity();
            link.setId(id);
            link.setProduct(product);
            link.setRawMaterial(rawMaterial);
            link.setRequiredQuantity(request.requiredQuantity());
            link.persist();
        } else {
            // Entity is already managed by JPA — just update the field,
            // the change will be flushed automatically on transaction commit.
            link.setRequiredQuantity(request.requiredQuantity());
        }

        return toResponse(link);
    }

    /** List all raw materials linked to a product. */
    public List<ProductMaterialResponseDto> listByProduct(String productId) {
        if (ProductEntity.findById(productId) == null) {
            throw new NotFoundException("Product not found with id: " + productId);
        }
        return ProductMaterialEntity.<ProductMaterialEntity>find("product.id", productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Remove the link between a product and a specific raw material. */
    @Transactional
    public void removeMaterial(String productId, String rawMaterialId) {
        ProductMaterialId id = new ProductMaterialId(productId, rawMaterialId);
        ProductMaterialEntity link = ProductMaterialEntity.findById(id);
        if (link == null) {
            throw new NotFoundException(
                    "Association not found for product " + productId +
                            " and raw material " + rawMaterialId);
        }
        link.delete();
    }

    private ProductMaterialResponseDto toResponse(ProductMaterialEntity e) {
        return new ProductMaterialResponseDto(
                e.getProduct().getId(),
                e.getProduct().getName(),
                e.getRawMaterial().getId(),
                e.getRawMaterial().getName(),
                e.getRequiredQuantity());
    }
}
