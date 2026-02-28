import { http } from "./http";

export interface Product {
     id: string;
     name: string;
     value: number;
}

export interface ProductRequest {
     name: string;
     value: number;
}

export const getProducts = () =>
     http.get<Product[]>("/products").then((r) => r.data);

export const getProductById = (id: string) =>
     http.get<Product>(`/products/${id}`).then((r) => r.data);

export const createProduct = (data: ProductRequest) =>
     http.post<Product>("/products", data).then((r) => r.data);

export const updateProduct = (id: string, data: ProductRequest) =>
     http.put<Product>(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: string) =>
     http.delete(`/products/${id}`);
