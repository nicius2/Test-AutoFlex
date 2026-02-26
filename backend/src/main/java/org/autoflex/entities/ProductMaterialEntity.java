package org.autoflex.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductMaterialEntity extends PanacheEntityBase {

    @EmbeddedId
    private ProductMaterialId id = new ProductMaterialId();

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    @ManyToOne
    @MapsId("rawMaterialId")
    @JoinColumn(name = "raw_material_id")
    private RawMaterialEntity rawMaterial;

    @Column(name = "required_quantity", nullable = false)
    private Integer requiredQuantity;
}
