import { redirect } from "next/navigation";
import ActivoFijoCreatePage from "./activo-fijo-create-page";

export default function Page({ searchParams }: { searchParams?: { tipo?: string } }) {
  if (searchParams?.tipo) {
    redirect(`/activo-fijo/nuevo/${searchParams.tipo}`);
  }

  return <ActivoFijoCreatePage />;
}
