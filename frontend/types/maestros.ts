export type MasterOption = {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
};

export type Tienda = MasterOption & {
  canal: string;
  ciudad: string;
};
