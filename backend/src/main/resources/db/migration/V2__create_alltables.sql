CREATE TABLE products (
    id VARCHAR(255 CHAR) PRIMARY KEY,
    name VARCHAR(150 CHAR) NOT NULL,
    value NUMBER(10) NOT NULL
);

CREATE TABLE raw_materials (
    id VARCHAR(36 CHAR) PRIMARY KEY,
    name VARCHAR(150 CHAR) NOT NULL,
    stock_quantity NUMBER(10) NOT NULL
);

CREATE TABLE product_materials (
    product_id VARCHAR(36 CHAR),
    raw_material_id VARCHAR(36 CHAR),
    required_quantity NUMBER(10) NOT NULL,
    CONSTRAINT pk_prod_mat PRIMARY KEY (product_id, raw_material_id),
    CONSTRAINT fk_pm_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_pm_material FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id)
);