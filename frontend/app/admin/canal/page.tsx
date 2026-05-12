import { AdminCrud } from "@/components/admin/AdminCrud";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { canales } from "@/mocks/maestros";

export default function CanalPage() {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-normal">Canal</h2>
        <AdminCrud title="Canal" rows={canales} />
      </div>
    </RoleGuard>
  );
}
