package org.autoflex.dto;

public record ProductMaterialResponseDto(
                String productId,
                String productName,
                String rawMaterialId,
                String rawMaterialName,
                Integer requiredQuantity) {
}
