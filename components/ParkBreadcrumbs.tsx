"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type BreadcrumbPath = { areaId: string; areaName: string; neighborhoodId?: string; neighborhoodName?: string };

export function ParkBreadcrumbs({ parkName, paths }: { parkName: string; paths: BreadcrumbPath[] }) {
  const params = useSearchParams();
  const requestedArea = params.get("area"), requestedNeighborhood = params.get("neighborhood");
  const selected = paths.find((path) => path.areaId === requestedArea && (!requestedNeighborhood || path.neighborhoodId === requestedNeighborhood))
    ?? paths.find((path) => path.neighborhoodId === requestedNeighborhood)
    ?? paths[0];
  if (!selected) return null;
  return <nav className="app-breadcrumbs" aria-label="Breadcrumb"><ol>
    <li><Link href="/areas/">Areas</Link></li>
    <li><Link href={`/areas/${selected.areaId}/`}>{selected.areaName}</Link></li>
    {selected.neighborhoodId && selected.neighborhoodName ? <li><Link href={`/neighborhoods/${selected.neighborhoodId}/?area=${selected.areaId}`}>{selected.neighborhoodName}</Link></li> : null}
    <li aria-current="page">{parkName}</li>
  </ol></nav>;
}
