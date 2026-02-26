package org.autoflex.dto;

import java.util.List;

public record ProductionResultDto(
          List<ProductionSuggestionDto> suggestions,
          Integer grandTotalValue) {
}
