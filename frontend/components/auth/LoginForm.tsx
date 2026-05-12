"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth-service";

const schema = z.object({
  username: z.string().min(1, "Ingrese usuario"),
  password: z.string().min(1, "Ingrese contrasena"),
});

type LoginFormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<LoginFormData>({ resolver: zodResolver(schema), defaultValues: { username: "admin", password: "admin123" } });

  async function onSubmit(values: LoginFormData) {
    setError("");
    try {
      const user = await authService.login(values);
      router.push(user.tipoUsuario === "ADMIN" ? "/dashboard" : "/activo-fijo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible iniciar sesion");
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Audiomusica Asset Management</CardTitle>
        <CardDescription>Ingrese con admin/admin123 o normal/normal123</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Usuario</label>
            <Input {...form.register("username")} />
            {form.formState.errors.username && <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contrasena</label>
            <Input type="password" {...form.register("password")} />
            {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
