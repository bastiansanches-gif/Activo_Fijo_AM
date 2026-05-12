import type { UsuarioSistema } from "./auth";

export type Usuario = UsuarioSistema & {
  email: string;
  cargo: string;
  codCC: string;
};
