export interface RawMaterial {
     id: string;
     name: string;
     stockQuantity: number;
}

export interface RawMaterialRequest {
     name: string;
     stockQuantity: number;
}

export interface RawMaterialFormProps {
     open: boolean;
     onClose: () => void;
     onSave: (data: RawMaterialRequest) => Promise<void>;
     initial?: RawMaterial | null;
}
