import type { Product, ProductRequest } from "../api/products";

export interface ProductFormProps {
     open: boolean;
     onClose: () => void;
     onSave: (data: ProductRequest) => Promise<void>;
     initial?: Product | null;
}