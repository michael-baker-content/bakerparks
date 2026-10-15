import type { Metadata } from "next";
import { Suspense } from "react";
import { ImageArchive } from "../../components/ImageArchive";
import { getPublicImageArchive, getPublicImageArchiveOptions } from "../../src/lib/image-archive.js";

export const metadata: Metadata = {
  title: "Park photographs",
  description: "Browse original and openly licensed photographs of San Francisco park and recreation destinations.",
};

export default function PhotosPage() {
  const images = getPublicImageArchive();
  const options = getPublicImageArchiveOptions();
  return <div className="app-image-archive">
    <header className="app-image-archive__header">
      <p className="app-eyebrow">Explore visually</p>
      <h1>Park photographs</h1>
      <p className="app-lede">Browse views, entrances, landscapes, and park features from across the collection. Select a photograph to see it at a larger size or follow its link to learn about the place.</p>
    </header>
    <Suspense fallback={<p>Loading photographs…</p>}><ImageArchive images={images} options={options} /></Suspense>
  </div>;
}
