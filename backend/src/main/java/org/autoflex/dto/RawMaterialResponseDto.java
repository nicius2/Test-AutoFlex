package org.autoflex.dto;

public record RawMaterialResponseDto(
        String id,
        String name,
        Integer stockQuantity
) {
}
