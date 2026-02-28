import { http } from "./http";

export interface ProductionSuggestionItem {
     productName: string;
     quantity: number;
     totalValue: number;
}

export interface ProductionSuggestionResponse {
     suggestions: ProductionSuggestionItem[];
     grandTotalValue: number;
}

export const getProductionSuggestion = () =>
     http
          .get<ProductionSuggestionResponse>("/raw-materials/production-suggestion")
          .then((r) => r.data);
