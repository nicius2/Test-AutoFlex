package org.autoflex.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductMaterialRequestDto(

          @NotBlank(message = "The raw material id is required") String rawMaterialId,

          @NotNull(message = "The required quantity is required") @Min(value = 1, message = "Required quantity must be at least 1") Integer requiredQuantity) {
}
