import { AdminCrud } from "@/components/admin/AdminCrud";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { centrosCosto } from "@/mocks/maestros";

export default function CentroCostoPage() {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-normal">CentroCosto</h2>
        <AdminCrud title="CentroCosto" rows={centrosCosto} />
      </div>
    </RoleGuard>
  );
}
