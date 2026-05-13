import { mockAuthUsers } from "@/mocks/usuarios";
import type { LoginCredentials, UsuarioSistema } from "@/types/auth";
import { delay } from "./delay";

const SESSION_KEY = "audiomusica.session";

export const authService = {
  async login(credentials: LoginCredentials) {
    const user = mockAuthUsers.find((item) => item.username === credentials.username && item.password === credentials.password);
    if (!user) throw new Error("Credenciales invalidas");
    const session: UsuarioSistema = {
      idUsuario: user.idUsuario,
      codUsuario: user.codUsuario,
      nomUsuario: user.nomUsuario,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      email: user.email,
      cargo: user.cargo,
      dimension: user.dimension,
      tipoUsuario: user.tipoUsuario,
      activo: user.activo,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return delay(session);
  },
  getSession(): UsuarioSistema | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UsuarioSistema) : null;
  },
  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};
