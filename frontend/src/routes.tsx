import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./__layout/AppLayout";
import { Products } from "./pages/Products";
import { RawMaterials } from "./pages/RawMaterials";
import { ProductionSuggestion } from "./pages/ProductionSuggestion";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <AppLayout />,
      children: [
         {
            index: true,
            element: <Navigate to="/products" replace />,
         },
         {
            path: "products",
            element: <Products />
         },
         {
            path: "raw-materials",
            element: <RawMaterials />
         },
         {
            path: "suggestions",
            element: <ProductionSuggestion />
         }
      ]
   }
]);