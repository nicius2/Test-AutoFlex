# AutoFlex Backend

REST API built with **Quarkus** for managing product and raw material inventory in an industrial context. The system allows registering products, raw materials, defining each product's bill of materials (BOM), and automatically calculating how many units can be produced with the current stock.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Java 21 | Main language |
| Quarkus 3.x | Backend framework |
| Hibernate ORM + Panache | Object-relational mapping |
| Oracle (JDBC) | Relational database |
| Flyway | Database versioning and migration |
| Lombok | Boilerplate reduction |
| SmallRye OpenAPI | Swagger UI documentation |
| JUnit 5 + Mockito | Unit testing |
| PanacheMock | Mocking Panache static methods |

---

## 🗄️ Data Model

The system uses a **many-to-many** relationship between `products` and `raw_materials`, implemented through the join table `product_materials`.

```
products                product_materials              raw_materials
────────────────        ──────────────────────────     ─────────────────────
id (PK)          ←───  product_id    (FK + PK comp.)  id (PK)
name                    raw_material_id (FK + PK comp) ──→ id
value                   required_quantity               name
                                                        stock_quantity
```

`product_materials` is an associative table **with extra data** (`required_quantity`), which is why it is mapped as its own entity (`ProductMaterialEntity`) with a composite key (`@EmbeddedId`).

### Flyway Migrations

| File | Description |
|---|---|
| `V1__create_products.sql` | Creates the `products` table |
| `V2__create_alltables.sql` | Creates `raw_materials` and `product_materials` with FK constraints |

---

## 📦 Project Structure

```
src/main/java/org/autoflex/
├── controller/
│   ├── ProductController.java          # Product CRUD
│   ├── RawMaterialController.java      # Raw material CRUD + production suggestion
│   └── ProductMaterialController.java  # Product ↔ raw material association (BOM)
├── services/
│   ├── ProductServices.java            # Product business logic
│   ├── RawMaterialServices.java        # Raw material business logic
│   ├── ProductMaterialServices.java    # BOM management
│   └── ProductionServices.java         # Production suggestion algorithm
├── entities/
│   ├── ProductEntity.java
│   ├── RawMaterialEntity.java
│   ├── ProductMaterialEntity.java
│   └── ProductMaterialId.java          # Composite key (Serializable)
├── dto/
│   ├── ProductRequestDto / ProductResponseDto
│   ├── RawMaterialRequestDto / RawMaterialResponseDto
│   ├── ProductMaterialRequestDto / ProductMaterialResponseDto
│   ├── ProductionSuggestionDto         # Per-product production suggestion
│   └── ProductionResultDto             # Aggregated result
└── mapper/
    ├── ProductMapper.java
    └── RawMaterialMapper.java
```

---

## 🌐 Endpoints

### Products — `/products`

| Method | Route | Description |
|---|---|---|
| POST | `/products` | Create product |
| GET | `/products` | List all |
| GET | `/products/{id}` | Find by ID |
| PUT | `/products/{id}` | Update |
| DELETE | `/products/{id}` | Delete |

### Raw Materials — `/raw-materials`

| Method | Route | Description |
|---|---|---|
| POST | `/raw-materials` | Create raw material |
| GET | `/raw-materials` | List all |
| GET | `/raw-materials/{id}` | Find by ID |
| PUT | `/raw-materials/{id}` | Update |
| DELETE | `/raw-materials/{id}` | Delete |
| GET | `/raw-materials/production-suggestion` | 🧮 Production suggestion |

### BOM — `/products/{productId}/materials`

| Method | Route | Description |
|---|---|---|
| POST | `/products/{productId}/materials` | Link raw material to product |
| GET | `/products/{productId}/materials` | List materials for a product |
| DELETE | `/products/{productId}/materials/{rawMaterialId}` | Remove link |

---

## 🧮 Production Suggestion Algorithm

`GET /raw-materials/production-suggestion`

Calculates which products can be manufactured with the current stock, prioritising those with the **highest unit value** (greedy strategy):

1. Sort all products by `value DESC`
2. For each product, query the BOM and compute `min(stock / required_quantity)` for each raw material
3. "Consume" the virtual stock and add to the suggestion list
4. Return the list with producible quantities and total monetary value

**Example response:**
```json
{
  "suggestions": [
    {
      "productId": "prod-abc",
      "productName": "Premium Screw",
      "productValue": 200,
      "quantity": 5,
      "totalValue": 1000
    }
  ],
  "grandTotalValue": 1000
}
```

---

## ✅ Unit Tests

Tests are written with **JUnit 5 + Mockito + PanacheMock**, following the unit test with CDI container pattern (`@QuarkusTest`).

```
src/test/java/org/autoflex/services/
├── ProductServicesTest.java        # 10 cases — Product CRUD
└── RawMaterialServicesTest.java    # 10 cases — Raw material CRUD
```

Each test class covers:
- ✅ `create` — persists and returns created object
- ✅ `findAll` — returns full list / returns empty list
- ✅ `findById` — found / throws `NotFoundException` when missing
- ✅ `update` — updates fields / throws `NotFoundException` when missing
- ✅ `delete` — deletes / throws `NotFoundException` when missing

Run all tests:
```shell
./mvnw test
```

---

## 📖 API Documentation (Swagger UI)

With the application running, access:

| URL | Description |
|---|---|
| `http://localhost:8080/swagger-ui` | Swagger visual interface |
| `http://localhost:8080/q/openapi` | OpenAPI contract (JSON/YAML) |

---

## ▶️ Running the Application

### Development mode (with live reload)
```shell
./mvnw quarkus:dev
```
> The Dev UI is available at `http://localhost:8080/q/dev/`

### Build and run
```shell
./mvnw package
java -jar target/quarkus-app/quarkus-run.jar
```

### Native build (requires GraalVM)
```shell
./mvnw package -Dnative
./target/backend-1.0.0-SNAPSHOT-runner
```

---

## ⚙️ Configuration

Main config in `src/main/resources/application.properties`:

```properties
# Database / JDBC / Flyway
quarkus.datasource.db-kind=oracle
quarkus.flyway.migrate-at-start=true

# Server
quarkus.http.port=8080

# Swagger
quarkus.swagger-ui.always-include=true
quarkus.swagger-ui.path=/swagger-ui
```
