import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./__layout/AppLayout";
import { Products } from "./pages/Products";

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
            element: <div className="text-gray-500">Raw Materials Page (Em breve)</div>
         },
         {
            path: "product-material",
            element: <div className="text-gray-500">Product Material Page (Em breve)</div>
         }
      ]
   }
]);