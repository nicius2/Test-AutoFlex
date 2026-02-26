package org.autoflex.dto;

/**
 * Represents a production suggestion for a single product.
 */

public record ProductionSuggestionDto(
                String productId,
                String productName,
                Integer productValue,
                Integer quantity,
                Integer totalValue) {
}
