import { AdminCrud } from "@/components/admin/AdminCrud";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { tiendas } from "@/mocks/maestros";

export default function AdminTiendasPage() {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-normal">Tiendas</h2>
        <AdminCrud title="Tiendas" rows={tiendas} />
      </div>
    </RoleGuard>
  );
}
