import { AdminCrud } from "@/components/admin/AdminCrud";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { categorias, marcas } from "@/mocks/maestros";

export default function MaestrosPage() {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-normal">Maestros</h2>
        <AdminCrud title="Categorias" rows={categorias} />
        <AdminCrud title="Marcas" rows={marcas} />
      </div>
    </RoleGuard>
  );
}
