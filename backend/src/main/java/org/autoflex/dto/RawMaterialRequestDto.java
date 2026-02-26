package org.autoflex.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RawMaterialRequestDto(

        @NotBlank(message = "The raw material name is required")
        String name,

        @NotNull(message = "The stock quantity is required")
        @Min(value = 0, message = "Stock quantity must be zero or positive")
        Integer stockQuantity
) {
}
