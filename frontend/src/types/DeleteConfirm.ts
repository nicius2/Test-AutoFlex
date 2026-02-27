import type { Product } from "./Product";

export interface DeleteConfirmProps {
     open: boolean;
     product: Product | null;
     onClose: () => void;
     onConfirm: () => Promise<void>;
}