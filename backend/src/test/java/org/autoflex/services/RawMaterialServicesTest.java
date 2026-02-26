package org.autoflex.services;

import io.quarkus.panache.mock.PanacheMock;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.autoflex.dto.RawMaterialRequestDto;
import org.autoflex.dto.RawMaterialResponseDto;
import org.autoflex.entities.RawMaterialEntity;
import org.autoflex.mapper.RawMaterialMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
class RawMaterialServicesTest {

     @Inject
     RawMaterialServices rawMaterialServices;

     @InjectMock
     RawMaterialMapper mapper;

     // builders

     private RawMaterialEntity buildEntity(String id, String name, Integer stock) {
          RawMaterialEntity entity = new RawMaterialEntity();
          entity.setId(id);
          entity.setName(name);
          entity.setStockQuantity(stock);
          return entity;
     }

     private RawMaterialRequestDto buildRequest(String name, Integer stock) {
          return new RawMaterialRequestDto(name, stock);
     }

     private RawMaterialResponseDto buildResponse(String id, String name, Integer stock) {
          return new RawMaterialResponseDto(id, name, stock);
     }

     @BeforeEach
     void setup() {
          PanacheMock.mock(RawMaterialEntity.class);
     }

     // create

     @Test
     @DisplayName("create: should persist and return the created raw material")
     void create_ShouldReturnCreatedRawMaterial() {
          RawMaterialRequestDto request = buildRequest("Steel", 100);
          RawMaterialEntity entity = buildEntity("rm-1", "Steel", 100);
          RawMaterialResponseDto response = buildResponse("rm-1", "Steel", 100);

          when(mapper.toEntity(request)).thenReturn(entity);
          doNothing().when(entity).persist();
          when(mapper.toResponse(entity)).thenReturn(response);

          RawMaterialResponseDto result = rawMaterialServices.create(request);

          assertNotNull(result);
          assertEquals("rm-1", result.id());
          assertEquals("Steel", result.name());
          assertEquals(100, result.stockQuantity());

          verify(mapper).toEntity(request);
          verify(mapper).toResponse(entity);
     }

     // findAll

     @Test
     @DisplayName("findAll: should return a list with all raw materials")
     void findAll_ShouldReturnAllRawMaterials() {
          RawMaterialEntity e1 = buildEntity("rm-1", "Steel", 100);
          RawMaterialEntity e2 = buildEntity("rm-2", "Copper", 50);

          PanacheMock.doReturn(List.of(e1, e2))
                    .when(RawMaterialEntity.class);
          RawMaterialEntity.listAll();

          when(mapper.toResponse(e1)).thenReturn(buildResponse("rm-1", "Steel", 100));
          when(mapper.toResponse(e2)).thenReturn(buildResponse("rm-2", "Copper", 50));

          List<RawMaterialResponseDto> result = rawMaterialServices.findAll();

          assertEquals(2, result.size());
          assertEquals("Steel", result.get(0).name());
          assertEquals("Copper", result.get(1).name());
     }

     @Test
     @DisplayName("findAll: should return empty list when no raw materials exist")
     void findAll_ShouldReturnEmptyList() {
          PanacheMock.doReturn(List.of())
                    .when(RawMaterialEntity.class);
          RawMaterialEntity.listAll();

          List<RawMaterialResponseDto> result = rawMaterialServices.findAll();

          assertTrue(result.isEmpty());
     }

     // findById

     @Test
     @DisplayName("findById: should return raw material when it exists")
     void findById_ShouldReturnRawMaterial_WhenFound() {
          RawMaterialEntity entity = buildEntity("rm-1", "Steel", 100);

          PanacheMock.doReturn(entity)
                    .when(RawMaterialEntity.class);
          RawMaterialEntity.findById("rm-1");

          when(mapper.toResponse(entity)).thenReturn(buildResponse("rm-1", "Steel", 100));

          RawMaterialResponseDto result = rawMaterialServices.findById("rm-1");

          assertNotNull(result);
          assertEquals("rm-1", result.id());
          assertEquals("Steel", result.name());
          assertEquals(100, result.stockQuantity());
     }

     @Test
     @DisplayName("findById: should throw NotFoundException when raw material does not exist")
     void findById_ShouldThrowNotFound_WhenMissing() {
          PanacheMock.doReturn(null)
                    .when(RawMaterialEntity.class);
          RawMaterialEntity.findById("missing-id");

          assertThrows(NotFoundException.class,
                    () -> rawMaterialServices.findById("missing-id"));
     }

     // update

     @Test
     @DisplayName("update: should update fields and return updated raw material")
     void update_ShouldUpdateRawMaterial_WhenFound() {
          RawMaterialEntity entity = buildEntity("rm-1", "Old Steel", 10);

          PanacheMock.doReturn(entity)
                    .when(RawMaterialEntity.class);
          RawMaterialEntity.findById("rm-1");

          RawMaterialRequestDto request = buildRequest("New Steel", 999);
          RawMaterialResponseDto response = buildResponse("rm-1", "New Steel", 999);

          when(mapper.toResponse(any())).thenReturn(response);

          RawMaterialResponseDto result = rawMaterialServices.update("rm-1", request);

          assertEquals("New Steel", entity.getName()); // field was mutated
          assertEquals(999, entity.getStockQuantity());
          assertEquals("New Steel", result.name());
          assertEquals(999, result.stockQuantity());
     }

     @Test
     @DisplayName("update: should throw NotFoundException when raw material does not exist")
     void update_ShouldThrowNotFound_WhenMissing() {
          PanacheMock.doReturn(null)
                    .when(RawMaterialEntity.class);
          RawMaterialEntity.findById("missing-id");

          assertThrows(NotFoundException.class,
                    () -> rawMaterialServices.update("missing-id", buildRequest("X", 1)));
     }

     // delete

     @Test
     @DisplayName("delete: should delete raw material when it exists")
     void delete_ShouldDeleteRawMaterial_WhenFound() {
          RawMaterialEntity entity = Mockito.spy(buildEntity("rm-1", "Steel", 100));

          PanacheMock.doReturn(entity)
                    .when(RawMaterialEntity.class);
          RawMaterialEntity.findById("rm-1");

          doNothing().when(entity).delete();

          assertDoesNotThrow(() -> rawMaterialServices.delete("rm-1"));
          verify(entity).delete();
     }

     @Test
     @DisplayName("delete: should throw NotFoundException when raw material does not exist")
     void delete_ShouldThrowNotFound_WhenMissing() {
          PanacheMock.doReturn(null)
                    .when(RawMaterialEntity.class);
          RawMaterialEntity.findById("missing-id");

          assertThrows(NotFoundException.class,
                    () -> rawMaterialServices.delete("missing-id"));
     }
}
