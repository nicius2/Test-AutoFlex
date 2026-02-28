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
*   Node.js & npm/pnpm
*   A running instance of Oracle Database (or edit the `application.properties` to switch to PostgreSQL/MySQL/H2)
