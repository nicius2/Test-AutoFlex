package org.autoflex.dto;

import jakarta.validation.constraints.NotBlank;

public record ProductRequestDto(

        @NotBlank(message = "The product name is required")
        String name,

        @NotBlank(message = "The product price is required")
        Integer value
) {
}
