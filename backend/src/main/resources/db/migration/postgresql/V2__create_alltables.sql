CREATE TABLE raw_materials (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    stock_quantity INTEGER NOT NULL
);

CREATE TABLE product_materials (
    product_id VARCHAR(255),
    raw_material_id VARCHAR(255),
    required_quantity INTEGER NOT NULL,
    CONSTRAINT pk_prod_mat PRIMARY KEY (product_id, raw_material_id),
    CONSTRAINT fk_pm_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_pm_material FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id)
);
