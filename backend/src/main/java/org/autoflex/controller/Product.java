package org.autoflex.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.autoflex.dto.ProductRequestDto;
import org.autoflex.services.ProductServices;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class Product {

    @Inject
    ProductServices productServices;

    @POST
    public Response createProduct(ProductRequestDto requestDto) {

        var response = productServices.create(requestDto);

        return Response.status(Response.Status.CREATED)
                .entity(response)
                .build();
    }

    @GET
    public Response product() {
        return Response.ok("api run server").build();
    }
}