import ActivoFijoDetailPage from "./activo-fijo-detail-page";

type PageProps = {
  params: {
    serie: string;
  };
};

export default function Page(props: PageProps) {
  return <ActivoFijoDetailPage {...props} />;
}
