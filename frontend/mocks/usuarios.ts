import type { UsuarioSistema } from "@/types/auth";
import type { Usuario } from "@/types/usuarios";

export const mockAuthUsers: Array<UsuarioSistema & { username: string; password: string }> = [
  { username: "admin", password: "admin123", codUsuario: "ADM001", nomUsuario: "Administrador TI", tipoUsuario: "ADMIN", activo: true },
  { username: "normal", password: "normal123", codUsuario: "USR001", nomUsuario: "Usuario Normal", tipoUsuario: "NORMAL", activo: true },
];

export const mockUsuarios: Usuario[] = [
  { codUsuario: "ADM001", nomUsuario: "Administrador TI", tipoUsuario: "ADMIN", activo: true, email: "admin@audiomusica.cl", cargo: "Jefe TI", codCC: "CC-TI" },
  { codUsuario: "USR001", nomUsuario: "Usuario Normal", tipoUsuario: "NORMAL", activo: true, email: "normal@audiomusica.cl", cargo: "Analista", codCC: "CC-OPS" },
  { codUsuario: "EMP245", nomUsuario: "Camila Rojas", tipoUsuario: "NORMAL", activo: true, email: "crojas@audiomusica.cl", cargo: "Vendedora", codCC: "CC-VTA" },
];
