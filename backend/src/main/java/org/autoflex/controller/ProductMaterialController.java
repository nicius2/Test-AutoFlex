package org.autoflex.controller;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.autoflex.dto.ProductMaterialRequestDto;
import org.autoflex.services.ProductMaterialServices;

@Path("/products/{productId}/materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductMaterialController {

    @Inject
    ProductMaterialServices productMaterialServices;

    @POST
    public Response addMaterial(@PathParam("productId") String productId,
            @Valid ProductMaterialRequestDto requestDto) {
        var response = productMaterialServices.addMaterial(productId, requestDto);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @GET
    public Response listByProduct(@PathParam("productId") String productId) {
        var response = productMaterialServices.listByProduct(productId);
        return Response.ok(response).build();
    }

    @DELETE
    @Path("/{rawMaterialId}")
    public Response removeMaterial(@PathParam("productId") String productId,
            @PathParam("rawMaterialId") String rawMaterialId) {
        productMaterialServices.removeMaterial(productId, rawMaterialId);
        return Response.noContent().build();
    }
}
