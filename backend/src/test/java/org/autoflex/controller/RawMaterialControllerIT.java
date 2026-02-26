package org.autoflex.controller;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class RawMaterialControllerIT {

     // ID criado no POST, reutilizado nos outros testes
     private static String createdId;

     // POST /raw-materials

     @Test
     @Order(1)
     @DisplayName("POST /raw-materials → 201 e retorna matéria-prima criada")
     void create_ShouldReturn201WithCreatedRawMaterial() {
          String body = """
                    { "name": "Aço Inox", "stockQuantity": 500 }
                    """;

          createdId = given()
                    .contentType(ContentType.JSON)
                    .body(body)
                    .when()
                    .post("/raw-materials")
                    .then()
                    .statusCode(201)
                    .body("name", equalTo("Aço Inox"))
                    .body("stockQuantity", equalTo(500))
                    .body("id", notNullValue())
                    .extract()
                    .path("id");
     }

     @Test
     @Order(2)
     @DisplayName("POST /raw-materials → 400 quando name está em branco")
     void create_ShouldReturn400_WhenNameIsBlank() {
          String body = """
                    { "name": "", "stockQuantity": 10 }
                    """;

          given()
                    .contentType(ContentType.JSON)
                    .body(body)
                    .when()
                    .post("/raw-materials")
                    .then()
                    .statusCode(400);
     }

     @Test
     @Order(3)
     @DisplayName("POST /raw-materials → 400 quando stockQuantity é negativo")
     void create_ShouldReturn400_WhenStockIsNegative() {
          String body = """
                    { "name": "Cobre", "stockQuantity": -1 }
                    """;

          given()
                    .contentType(ContentType.JSON)
                    .body(body)
                    .when()
                    .post("/raw-materials")
                    .then()
                    .statusCode(400);
     }

     // GET /raw-materials

     @Test
     @Order(4)
     @DisplayName("GET /raw-materials → 200 e lista com pelo menos uma matéria-prima")
     void findAll_ShouldReturn200WithList() {
          given()
                    .when()
                    .get("/raw-materials")
                    .then()
                    .statusCode(200)
                    .body("$", not(empty()));
     }

     // GET /raw-materials/{id}

     @Test
     @Order(5)
     @DisplayName("GET /raw-materials/{id} → 200 e retorna matéria-prima correta")
     void findById_ShouldReturn200WithCorrectRawMaterial() {
          given()
                    .when()
                    .get("/raw-materials/{id}", createdId)
                    .then()
                    .statusCode(200)
                    .body("id", equalTo(createdId))
                    .body("name", equalTo("Aço Inox"))
                    .body("stockQuantity", equalTo(500));
     }

     @Test
     @Order(6)
     @DisplayName("GET /raw-materials/{id} → 404 quando não existe")
     void findById_ShouldReturn404_WhenNotFound() {
          given()
                    .when()
                    .get("/raw-materials/{id}", "id-inexistente")
                    .then()
                    .statusCode(404);
     }

     // PUT /raw-materials/{id}

     @Test
     @Order(7)
     @DisplayName("PUT /raw-materials/{id} → 200 e retorna matéria-prima atualizada")
     void update_ShouldReturn200WithUpdatedRawMaterial() {
          String body = """
                    { "name": "Aço Carbono", "stockQuantity": 999 }
                    """;

          given()
                    .contentType(ContentType.JSON)
                    .body(body)
                    .when()
                    .put("/raw-materials/{id}", createdId)
                    .then()
                    .statusCode(200)
                    .body("name", equalTo("Aço Carbono"))
                    .body("stockQuantity", equalTo(999));
     }

     @Test
     @Order(8)
     @DisplayName("PUT /raw-materials/{id} → 404 quando não existe")
     void update_ShouldReturn404_WhenNotFound() {
          String body = """
                    { "name": "X", "stockQuantity": 1 }
                    """;

          given()
                    .contentType(ContentType.JSON)
                    .body(body)
                    .when()
                    .put("/raw-materials/{id}", "id-inexistente")
                    .then()
                    .statusCode(404);
     }

     // DELETE /raw-materials/{id}

     @Test
     @Order(9)
     @DisplayName("DELETE /raw-materials/{id} → 204 ao deletar matéria-prima existente")
     void delete_ShouldReturn204_WhenFound() {
          given()
                    .when()
                    .delete("/raw-materials/{id}", createdId)
                    .then()
                    .statusCode(204);
     }

     @Test
     @Order(10)
     @DisplayName("DELETE /raw-materials/{id} → 404 quando não existe")
     void delete_ShouldReturn404_WhenNotFound() {
          given()
                    .when()
                    .delete("/raw-materials/{id}", "id-inexistente")
                    .then()
                    .statusCode(404);
     }

     // GET /raw-materials/production-suggestion

     @Test
     @Order(11)
     @DisplayName("GET /raw-materials/production-suggestion → 200 e retorna lista")
     void suggestProduction_ShouldReturn200() {
          given()
                    .when()
                    .get("/raw-materials/production-suggestion")
                    .then()
                    .statusCode(200)
                    .body("suggestions", instanceOf(java.util.List.class))
                    .body("grandTotalValue", notNullValue());
     }
}
