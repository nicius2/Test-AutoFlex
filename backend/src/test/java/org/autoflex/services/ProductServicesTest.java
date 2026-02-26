package org.autoflex.services;

import io.quarkus.panache.mock.PanacheMock;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.autoflex.dto.ProductRequestDto;
import org.autoflex.dto.ProductResponseDto;
import org.autoflex.entities.ProductEntity;
import org.autoflex.mapper.ProductMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
class ProductServicesTest {

    @Inject
    ProductServices productServices;

    @InjectMock
    ProductMapper mapper;


    private ProductEntity buildEntity(String id, String name, Integer value) {
        ProductEntity entity = new ProductEntity();
        entity.setId(id);
        entity.setName(name);
        entity.setValue(value);
        return entity;
    }

    private ProductRequestDto buildRequest(String name, Integer value) {
        return new ProductRequestDto(name, value);
    }

    private ProductResponseDto buildResponse(String id, String name, Integer value) {
        return new ProductResponseDto(id, name, value);
    }

    @BeforeEach
    void setup() {
        // Activate Panache mock for every test
        PanacheMock.mock(ProductEntity.class);
    }

    // create

    @Test
    @DisplayName("create: should persist and return the created product")
    void create_ShouldReturnCreatedProduct() {
        ProductRequestDto  request  = buildRequest("Steel Bolt", 50);
        ProductEntity      entity   = buildEntity("abc-123", "Steel Bolt", 50);
        ProductResponseDto response = buildResponse("abc-123", "Steel Bolt", 50);

        when(mapper.toEntity(request)).thenReturn(entity);
        doNothing().when(entity).persist();          // persist() is mocked via PanacheMock
        when(mapper.toResponse(entity)).thenReturn(response);

        ProductResponseDto result = productServices.create(request);

        assertNotNull(result);
        assertEquals("abc-123",    result.id());
        assertEquals("Steel Bolt", result.name());
        assertEquals(50,           result.value());

        verify(mapper).toEntity(request);
        verify(mapper).toResponse(entity);
    }

    // findAll

    @Test
    @DisplayName("findAll: should return a list with all products")
    void findAll_ShouldReturnAllProducts() {
        ProductEntity e1 = buildEntity("id-1", "Gear",   100);
        ProductEntity e2 = buildEntity("id-2", "Spring", 200);

        PanacheMock.doReturn(List.of(e1, e2))
                   .when(ProductEntity.class);
        ProductEntity.listAll();

        when(mapper.toResponse(e1)).thenReturn(buildResponse("id-1", "Gear",   100));
        when(mapper.toResponse(e2)).thenReturn(buildResponse("id-2", "Spring", 200));

        List<ProductResponseDto> result = productServices.findAll();

        assertEquals(2, result.size());
        assertEquals("Gear",   result.get(0).name());
        assertEquals("Spring", result.get(1).name());
    }

    @Test
    @DisplayName("findAll: should return empty list when no products exist")
    void findAll_ShouldReturnEmptyList() {
        PanacheMock.doReturn(List.of())
                   .when(ProductEntity.class);
        ProductEntity.listAll();

        List<ProductResponseDto> result = productServices.findAll();

        assertTrue(result.isEmpty());
    }

    // findById

    @Test
    @DisplayName("findById: should return product when it exists")
    void findById_ShouldReturnProduct_WhenFound() {
        ProductEntity entity = buildEntity("id-1", "Gear", 100);

        PanacheMock.doReturn(entity)
                   .when(ProductEntity.class);
        ProductEntity.findById("id-1");

        when(mapper.toResponse(entity)).thenReturn(buildResponse("id-1", "Gear", 100));

        ProductResponseDto result = productServices.findById("id-1");

        assertNotNull(result);
        assertEquals("id-1", result.id());
        assertEquals("Gear", result.name());
    }

    @Test
    @DisplayName("findById: should throw NotFoundException when product does not exist")
    void findById_ShouldThrowNotFound_WhenMissing() {
        PanacheMock.doReturn(null)
                   .when(ProductEntity.class);
        ProductEntity.findById("missing-id");

        assertThrows(NotFoundException.class,
                () -> productServices.findById("missing-id"));
    }

    // update

    @Test
    @DisplayName("update: should update fields and return updated product")
    void update_ShouldUpdateProduct_WhenFound() {
        ProductEntity entity = buildEntity("id-1", "Old Name", 10);

        PanacheMock.doReturn(entity)
                   .when(ProductEntity.class);
        ProductEntity.findById("id-1");

        ProductRequestDto  request  = buildRequest("New Name", 99);
        ProductResponseDto response = buildResponse("id-1", "New Name", 99);

        when(mapper.toResponse(any())).thenReturn(response);

        ProductResponseDto result = productServices.update("id-1", request);

        assertEquals("New Name", entity.getName());  // field was mutated
        assertEquals(99,         entity.getValue());
        assertEquals("New Name", result.name());
    }

    @Test
    @DisplayName("update: should throw NotFoundException when product does not exist")
    void update_ShouldThrowNotFound_WhenMissing() {
        PanacheMock.doReturn(null)
                   .when(ProductEntity.class);
        ProductEntity.findById("missing-id");

        assertThrows(NotFoundException.class,
                () -> productServices.update("missing-id", buildRequest("X", 1)));
    }

    // delete

    @Test
    @DisplayName("delete: should delete product when it exists")
    void delete_ShouldDeleteProduct_WhenFound() {
        ProductEntity entity = Mockito.spy(buildEntity("id-1", "Gear", 100));

        PanacheMock.doReturn(entity)
                   .when(ProductEntity.class);
        ProductEntity.findById("id-1");

        doNothing().when(entity).delete();

        assertDoesNotThrow(() -> productServices.delete("id-1"));
        verify(entity).delete();
    }

    @Test
    @DisplayName("delete: should throw NotFoundException when product does not exist")
    void delete_ShouldThrowNotFound_WhenMissing() {
        PanacheMock.doReturn(null)
                   .when(ProductEntity.class);
        ProductEntity.findById("missing-id");

        assertThrows(NotFoundException.class,
                () -> productServices.delete("missing-id"));
    }
}
