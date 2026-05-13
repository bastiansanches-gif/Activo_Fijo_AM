import ActivoFijoCreatePage from "./activo-fijo-create-page";

export default function Page({ searchParams }: { searchParams?: { tipo?: string } }) {
  return <ActivoFijoCreatePage selectedType={searchParams?.tipo ?? null} />;
}
