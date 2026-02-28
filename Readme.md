# Projedata Autoflex Test

This repository contains the practical test developed for **Autoflex (Projedata)**. The goal of this full-stack application is to provide a comprehensive inventory management system for a manufacturing industry, allowing it to manage products and the raw materials required for their production. 

The system additionally analyzes available stock to suggest which products can be manufactured, prioritizing items with the highest sales value.

<img width="955" height="700" alt="vini" src="https://github.com/user-attachments/assets/2aa17499-3287-46a3-85ab-01ad648ac4b6" />



---

## Technologies & Frameworks

All development, database schemas, variables, and comments have been structured entirely in English, as per the project requirements.

### Backend Stack
*   **Language:** Java 21
*   **Framework:** Quarkus (RESTEasy Reactive)
*   **Data Access Layer:** Hibernate ORM with Panache (Active Record / Repository Pattern)
*   **Database Migrations:** Flyway
*   **Database Connector:** Quarkus JDBC Oracle (Also mapped to H2 for in-memory testing)
*   **Testing:** JUnit 5, Mockito (for mocking dependencies like `ProductMapper` and Panache entities), and REST Assured

### Frontend Stack
*   **Language:** TypeScript
*   **Library:** React 19 (Bootstrapped with Vite)
*   **Styling & UI:** Tailwind CSS and Radix UI Themes for modern, highly responsive design.
*   **HTTP Client:** Axios
*   **Form Validation:** Zod
*   **Quality Assurance & Testing:** Cypress (Integration tests), ESLint

---

## Architectural Model

The system strictly adheres to the **API structural concept**, completely decoupling the backend services from the frontend graphical user interface.

*   **Backend (API Server):** Designed to expose RESTful endpoints, enforce business constraints (such as calculating the optimal production suggestions), and manage data persistence.
*   **Frontend (Client application):** Designed using responsive web interfaces to consume the backend API, allowing the user to seamlessly interact with the inventory data.

This architecture ensures a clear separation of concerns, scalability, and independent deployment of both layers.

---

## Database Design & Composite Key Usage

The application connects to an enterprise-grade Relational Database Management System (RDBMS), specifically configured for **Oracle** (with seamless support for PostgreSQL or MySQL).

### Association Strategy (Composite Key)

To accurately manage the relationship between a Product and its Raw Materials, the database uses an association table. In the backend Object-Relational Mapping (ORM), this is modeled by the `ProductMaterialEntity`.

Instead of using an artificial `id` (surrogate key) for this relationship, the design implements an **embedded composite key** (`ProductMaterialId`). This composite key consists of:
1.  `product_id` (Foreign Key referencing the Product)
2.  `raw_material_id` (Foreign Key referencing the Raw Material)

**Why a Composite Key?**
By using a composite primary key consisting of both foreign keys, the database inherently centralizes the relationship and enforces integrity. It guarantees that a specific raw material can only be registered once per product recipe. It also attaches the `required_quantity` field directly to this unique relationship pair, preventing duplicate data entries and making the dependency tree highly efficient to query.

---



## System Requirements

To run this project locally, ensure you have the following installed:
*   Java Development Kit (JDK) 21+
*   Node.js & Yarn
*   Docker (to run the Oracle database via `docker compose`)

---

## Database Strategy per Environment

The backend uses **Quarkus profiles** to switch between databases automatically. No code changes are needed — only the active profile and the corresponding environment variables determine which database is used.

| Environment | Profile | Database | How it starts |
|---|---|---|---|
| **Local dev** | `dev` | Oracle XE 21c | `docker compose up -d` inside `backend/` |
| **CI (GitHub Actions)** | `ci` | PostgreSQL 16 | Service container spun up automatically by the workflow |
| **Production (Railway)** | `prod` | PostgreSQL (Railway) | Managed cloud instance, credentials injected via Railway env vars |

### Local Development (`dev` profile)

The `dev` profile is active by default when you run `./mvnw quarkus:dev`. It connects to an Oracle XE instance started via Docker Compose.

Required `.env` inside `backend/`:
```env
ORACLE_PASSWORD=your_oracle_password
ORACLE_PORT=1521
```

Start the database first, then the backend:
```bash
cd backend
docker compose up -d        # starts Oracle XE
./mvnw quarkus:dev          # starts Quarkus (dev profile)
```

### CI / E2E Tests (`ci` profile)

When the `frontend-e2e` GitHub Actions workflow runs, it spins up a **PostgreSQL 16** service container and passes the connection details as environment variables. The `ci` profile reads them directly:

```
DB_URL      → jdbc:postgresql://localhost:5432/autoflex
DB_USERNAME → autoflex
DB_PASSWORD → autoflex
```

No manual setup is needed — the workflow handles everything.

### Production / Railway (`prod` profile)

The `prod` profile connects to the managed PostgreSQL instance on Railway using TCP Proxy credentials. These must be set as environment variables in the Railway dashboard or deployment config:

```env
PGHOST=<railway-proxy-host>
PGPORT=<railway-proxy-port>
PGDATABASE=railway
PGUSER=postgres
PGPASSWORD=<your-password>
```

### Flyway Migrations

Flyway runs automatically on every startup (`migrate-at-start=true`). Migration scripts are organized by database dialect:

```
backend/src/main/resources/db/migration/
├── oracle/       ← used by the dev profile
└── postgresql/   ← used by the ci and prod profiles
```

