package org.autoflex.controller;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ProductControllerIT {

     private static String createdId;

     // POST /products

     @Test
     @Order(1)
     @DisplayName("POST /products → 201 e retorna o produto criado")
     void create_ShouldReturn201WithCreatedProduct() {
          String body = """
                    { "name": "Parafuso M6", "value": 15 }
                    """;

          createdId = given()
                    .contentType(ContentType.JSON)
                    .body(body)
                    .when()
                    .post("/products")
                    .then()
                    .statusCode(201)
                    .body("name", equalTo("Parafuso M6"))
                    .body("value", equalTo(15))
                    .body("id", notNullValue())
                    .extract()
                    .path("id");
     }

     @Test
     @Order(2)
     @DisplayName("POST /products → 400 quando body inválido (name em branco)")
     void create_ShouldReturn400_WhenNameIsBlank() {
          String body = """
                    { "name": "", "value": 10 }
                    """;

          given()
                    .contentType(ContentType.JSON)
                    .body(body)
                    .when()
                    .post("/products")
                    .then()
                    .statusCode(400);
     }

     // GET /products

     @Test
     @Order(3)
     @DisplayName("GET /products → 200 e lista com pelo menos um produto")
     void findAll_ShouldReturn200WithList() {
          given()
                    .when()
                    .get("/products")
                    .then()
                    .statusCode(200)
                    .body("$", not(empty()));
     }

     // GET /products/{id}

     @Test
     @Order(4)
     @DisplayName("GET /products/{id} → 200 e retorna o produto correto")
     void findById_ShouldReturn200WithCorrectProduct() {
          given()
                    .when()
                    .get("/products/{id}", createdId)
                    .then()
                    .statusCode(200)
                    .body("id", equalTo(createdId))
                    .body("name", equalTo("Parafuso M6"))
                    .body("value", equalTo(15));
     }

     @Test
     @Order(5)
     @DisplayName("GET /products/{id} → 404 quando produto não existe")
     void findById_ShouldReturn404_WhenNotFound() {
          given()
                    .when()
                    .get("/products/{id}", "id-inexistente")
                    .then()
                    .statusCode(404);
     }

     // PUT /products/{id}

     @Test
     @Order(6)
     @DisplayName("PUT /products/{id} → 200 e retorna produto atualizado")
     void update_ShouldReturn200WithUpdatedProduct() {
          String body = """
                    { "name": "Parafuso M8", "value": 25 }
                    """;

          given()
                    .contentType(ContentType.JSON)
                    .body(body)
                    .when()
                    .put("/products/{id}", createdId)
                    .then()
                    .statusCode(200)
                    .body("name", equalTo("Parafuso M8"))
                    .body("value", equalTo(25));
     }

     @Test
     @Order(7)
     @DisplayName("PUT /products/{id} → 404 quando produto não existe")
     void update_ShouldReturn404_WhenNotFound() {
          String body = """
                    { "name": "X", "value": 1 }
                    """;

          given()
                    .contentType(ContentType.JSON)
                    .body(body)
                    .when()
                    .put("/products/{id}", "id-inexistente")
                    .then()
                    .statusCode(404);
     }

     // DELETE /products/{id}

     @Test
     @Order(8)
     @DisplayName("DELETE /products/{id} → 204 ao deletar produto existente")
     void delete_ShouldReturn204_WhenFound() {
          given()
                    .when()
                    .delete("/products/{id}", createdId)
                    .then()
                    .statusCode(204);
     }

     @Test
     @Order(9)
     @DisplayName("DELETE /products/{id} → 404 quando produto não existe")
     void delete_ShouldReturn404_WhenNotFound() {
          given()
                    .when()
                    .delete("/products/{id}", "id-inexistente")
                    .then()
                    .statusCode(404);
     }
}
