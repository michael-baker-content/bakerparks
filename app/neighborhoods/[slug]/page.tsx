import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceLanding, PlaceTiles } from "../../../components/PlaceLanding";
import { getAreaForNeighborhood, getNeighborhood, getNeighborhoods, hasVisibleDestinationImages } from "../../../src/lib/place-pages.js";

export const dynamicParams = false;
export function generateStaticParams() { return getNeighborhoods().map(({ id }) => ({ slug: id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const page = getNeighborhood((await params).slug); return { title: page?.name ?? "Neighborhood not found", description: page?.shortDescription }; }

export default async function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const neighborhood = getNeighborhood((await params).slug); if (!neighborhood) notFound();
  const area = getAreaForNeighborhood(neighborhood.id);
  const context = area ? `?area=${area.id}&neighborhood=${neighborhood.id}` : `?neighborhood=${neighborhood.id}`;
  const photoHref = hasVisibleDestinationImages(neighborhood.destinationIds) ? `/photos/?neighborhood=${neighborhood.id}` : undefined;
  return <PlaceLanding eyebrow="Neighborhood" page={neighborhood} photoHref={photoHref}><PlaceTiles heading="Parks and recreation destinations" tiles={neighborhood.parks.map((park: any) => ({ id: park.id, name: park.publicName, shortDescription: park.placeTypes.slice(0, 2).join(" · ") || "Park destination", href: `/parks/${park.id}/${context}`, image: park.image }))} /></PlaceLanding>;
}
