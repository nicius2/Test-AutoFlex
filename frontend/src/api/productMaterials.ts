import { http } from "./http";

export interface ProductMaterialResponseDto {
     productId: string;
     productName: string;
     rawMaterialId: string;
     rawMaterialName: string;
     requiredQuantity: number;
}

export interface ProductMaterialRequestDto {
     rawMaterialId: string;
     requiredQuantity: number;
}

export const getProductMaterials = (productId: string) =>
     http.get<ProductMaterialResponseDto[]>(`/products/${productId}/materials`).then((r) => r.data);

export const addProductMaterial = (productId: string, data: ProductMaterialRequestDto) =>
     http.post<ProductMaterialResponseDto>(`/products/${productId}/materials`, data).then((r) => r.data);

export const removeProductMaterial = (productId: string, rawMaterialId: string) =>
     http.delete(`/products/${productId}/materials/${rawMaterialId}`);
