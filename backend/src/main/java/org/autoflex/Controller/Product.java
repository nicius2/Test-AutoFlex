package org.autoflex.Controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/products")
public class Product {

    @GET
    public Response product() {
        return Response.ok("api run server").build();
    }
}
