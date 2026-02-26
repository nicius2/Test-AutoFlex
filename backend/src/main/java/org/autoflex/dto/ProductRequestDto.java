package org.autoflex.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductRequestDto(

        @NotBlank(message = "The product name is required")
        String name,

        @NotNull(message = "The product price is required")
        Integer value
) {
}
