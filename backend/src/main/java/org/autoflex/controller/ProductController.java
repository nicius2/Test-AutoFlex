package org.autoflex.controller;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.autoflex.dto.ProductRequestDto;
import org.autoflex.services.ProductServices;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductController {

    @Inject
    ProductServices productServices;

    @POST
    public Response create(@Valid ProductRequestDto requestDto) {
        var response = productServices.create(requestDto);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @GET
    public Response findAll() {
        var response = productServices.findAll();
        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") String id) {
        var response = productServices.findById(id);
        return Response.ok(response).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") String id, @Valid ProductRequestDto requestDto) {
        var response = productServices.update(id, requestDto);
        return Response.ok(response).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") String id) {
        productServices.delete(id);
        return Response.noContent().build();
    }
}