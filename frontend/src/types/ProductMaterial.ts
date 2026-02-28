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
