import { API_BASE_URL, apiClient } from "./apiClient";

export type Checklist = {
  idChecklist: number;
  nombreChecklist: string;
  tipoChecklist: string;
  nombreArchivo: string;
  rutaArchivo: string;
  extensionArchivo: string;
  fechaCreacion: string;
};

export const checklistService = {
  list: () => apiClient<Checklist[]>("/checklist"),
  downloadUrl: (id: number) => `${API_BASE_URL}/checklist/${id}/download`,
};
