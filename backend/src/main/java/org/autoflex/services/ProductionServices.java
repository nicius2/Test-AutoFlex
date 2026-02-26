package org.autoflex.services;

import jakarta.enterprise.context.ApplicationScoped;
import org.autoflex.dto.ProductionResultDto;
import org.autoflex.dto.ProductionSuggestionDto;
import org.autoflex.entities.ProductEntity;
import org.autoflex.entities.ProductMaterialEntity;
import org.autoflex.entities.RawMaterialEntity;

import java.util.*;

@ApplicationScoped
public class ProductionServices {

     public ProductionResultDto suggestProduction() {

          Map<String, Integer> availableStock = buildStockMap();

          List<ProductEntity> products = ProductEntity.<ProductEntity>listAll()
                    .stream()
                    .sorted(Comparator.comparingInt(ProductEntity::getValue).reversed())
                    .toList();

          List<ProductionSuggestionDto> suggestions = new ArrayList<>();

          for (ProductEntity product : products) {
               List<ProductMaterialEntity> bom = ProductMaterialEntity.find(
                         "product.id", product.getId()).list();

               if (bom.isEmpty()) {
                    continue;
               }

               int quantity = computeMaxUnits(bom, availableStock);

               if (quantity <= 0) {
                    continue;
               }

               for (ProductMaterialEntity item : bom) {
                    String matId = item.getRawMaterial().getId();
                    availableStock.merge(matId, -(quantity * item.getRequiredQuantity()), (a, b) -> a + b);
               }

               suggestions.add(new ProductionSuggestionDto(
                         product.getId(),
                         product.getName(),
                         product.getValue(),
                         quantity,
                         product.getValue() * quantity));
          }

          int grandTotal = suggestions.stream()
                    .mapToInt(ProductionSuggestionDto::totalValue)
                    .sum();

          return new ProductionResultDto(suggestions, grandTotal);
     }

     private Map<String, Integer> buildStockMap() {
          Map<String, Integer> stock = new HashMap<>();
          RawMaterialEntity.<RawMaterialEntity>listAll()
                    .forEach(rm -> stock.put(rm.getId(), rm.getStockQuantity()));
          return stock;
     }

     private int computeMaxUnits(List<ProductMaterialEntity> bom,
               Map<String, Integer> availableStock) {
          int max = Integer.MAX_VALUE;
          for (ProductMaterialEntity item : bom) {
               String matId = item.getRawMaterial().getId();
               int inStock = availableStock.getOrDefault(matId, 0);
               int required = item.getRequiredQuantity();
               max = Math.min(max, inStock / required);
          }
          return max == Integer.MAX_VALUE ? 0 : max;
     }
}
