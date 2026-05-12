export type TipoUsuario = "ADMIN" | "NORMAL";

export type UsuarioSistema = {
  codUsuario: string;
  nomUsuario: string;
  tipoUsuario: TipoUsuario;
  activo: boolean;
};

export type LoginCredentials = {
  username: string;
  password: string;
};
