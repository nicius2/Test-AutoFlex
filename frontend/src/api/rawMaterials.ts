import { http } from "./http";

export interface RawMaterial {
     id: string;
     name: string;
     stockQuantity: number;
}

export interface RawMaterialRequest {
     name: string;
     stockQuantity: number;
}

export const getRawMaterials = () =>
     http.get<RawMaterial[]>("/raw-materials").then((r) => r.data);

export const getRawMaterialById = (id: string) =>
     http.get<RawMaterial>(`/raw-materials/${id}`).then((r) => r.data);

export const createRawMaterial = (data: RawMaterialRequest) =>
     http.post<RawMaterial>("/raw-materials", data).then((r) => r.data);

export const updateRawMaterial = (id: string, data: RawMaterialRequest) =>
     http.put<RawMaterial>(`/raw-materials/${id}`, data).then((r) => r.data);

export const deleteRawMaterial = (id: string) =>
     http.delete(`/raw-materials/${id}`);
