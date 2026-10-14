import type { Metadata } from "next";
import { PlaceLanding, PlaceTiles } from "../../components/PlaceLanding";
import { getAreas } from "../../src/lib/place-pages.js";

export const metadata: Metadata = { title: "Areas", description: "Browse San Francisco park destinations by area and neighborhood." };

export default function AreasPage() {
  const areas = getAreas();
  const introduction = { id: "areas", name: "Explore by area", shortDescription: "Start with a part of San Francisco, then narrow your choices by neighborhood.", overview: "These practical browsing areas group the neighborhood labels already used by SF Parks Explorer. They are designed for finding nearby park options rather than defining official neighborhood boundaries.", sources: [{ title: "List of neighborhoods in San Francisco — Wikipedia", url: "https://en.wikipedia.org/wiki/List_of_neighborhoods_in_San_Francisco" }] };
  return <PlaceLanding eyebrow="Browse the city" page={introduction}><PlaceTiles heading="Areas" tiles={areas.map((area) => ({ id: area.id, name: area.name, shortDescription: area.shortDescription, href: `/areas/${area.id}/`, image: area.image }))} /></PlaceLanding>;
}
