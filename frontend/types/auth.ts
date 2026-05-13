export type TipoUsuario = "ADMIN" | "NORMAL";

export type UsuarioSistema = {
  codUsuario: string;
  idUsuario?: number;
  nomUsuario: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  email?: string;
  cargo?: string;
  dimension?: string;
  tipoUsuario: TipoUsuario;
  activo: boolean;
};

export type LoginCredentials = {
  username: string;
  password: string;
};
