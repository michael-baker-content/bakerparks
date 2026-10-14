import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceLanding, PlaceTiles } from "../../../components/PlaceLanding";
import { getArea, getAreas } from "../../../src/lib/place-pages.js";
import media from "../../../data/media/media-manifest.json";

export const dynamicParams = false;
export function generateStaticParams() { return getAreas().map(({ id }) => ({ slug: id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const page = getArea((await params).slug); return { title: page?.name ?? "Area not found", description: page?.shortDescription }; }

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const area = getArea((await params).slug); if (!area) notFound();
  const tiles = area.neighborhoods.length ? area.neighborhoods.map((item: any) => ({ id: item.id, name: item.name, shortDescription: item.shortDescription, href: `/neighborhoods/${item.id}/?area=${area.id}`, image: item.image })) : area.directDestinations.map((park: any) => ({ id: park.id, name: park.publicName, shortDescription: park.neighborhood || park.placeTypes.join(" · "), href: `/parks/${park.id}/?area=${area.id}`, image: media.images.find((image) => image.destinationId === park.id && image.visible !== false) }));
  return <PlaceLanding eyebrow="Area" page={area}><PlaceTiles heading={area.neighborhoods.length ? "Neighborhoods in this area" : "Park destinations in this area"} tiles={tiles} /></PlaceLanding>;
}
