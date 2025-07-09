import ListingDetail from "@/components/organisms/ListingsDetails";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingDetailsPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="min-h-screen">
      <ListingDetail id={id} />
    </div>
  );
}
