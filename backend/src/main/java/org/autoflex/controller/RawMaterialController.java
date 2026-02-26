package org.autoflex.controller;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.autoflex.dto.RawMaterialRequestDto;
import org.autoflex.services.ProductionServices;
import org.autoflex.services.RawMaterialServices;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialController {

    @Inject
    RawMaterialServices rawMaterialServices;

    @Inject
    ProductionServices productionServices;

    @POST
    public Response create(@Valid RawMaterialRequestDto requestDto) {
        var response = rawMaterialServices.create(requestDto);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @GET
    public Response findAll() {
        var response = rawMaterialServices.findAll();
        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") String id) {
        var response = rawMaterialServices.findById(id);
        return Response.ok(response).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") String id,
            @Valid RawMaterialRequestDto requestDto) {
        var response = rawMaterialServices.update(id, requestDto);
        return Response.ok(response).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") String id) {
        rawMaterialServices.delete(id);
        return Response.noContent().build();
    }

    @GET
    @Path("/production-suggestion")
    public Response suggestProduction() {
        var result = productionServices.suggestProduction();
        return Response.ok(result).build();
    }
}
