import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-normal text-primary">404</p>
      <h1 className="text-3xl font-semibold tracking-normal">Pagina no encontrada</h1>
      <p className="text-muted-foreground">La ruta solicitada no existe en Audiomusica Asset Management.</p>
      <Link className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow" href="/dashboard">
        Volver al dashboard
      </Link>
    </div>
  );
}
