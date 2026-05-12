"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = authService.getSession();
    router.replace(user?.tipoUsuario === "ADMIN" ? "/dashboard" : user ? "/activo-fijo" : "/login");
  }, [router]);

  return null;
}
