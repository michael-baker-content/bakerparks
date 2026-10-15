import Link from "next/link";
import { ParkAlert } from "./ParkAlert";
import { resolveMediaAsset } from "../src/lib/media-delivery.js";
import { getActiveParkNotice } from "../src/lib/park-notices.js";
import { PlaceSourceDialog } from "./PlaceSourceDialog";

type Source = { title: string; url: string };
type Alert = { destinationId: string; active: boolean; title: string; body: string; expiresOn?: string; url?: string; urlText?: string };
type ImageRecord = { localPath: string; width: number; height: number; alt: string; attribution: string; filePageUrl: string; licenseId: string; licenseUrl: string };
type Tile = { id: string; name: string; shortDescription: string; href: string; image?: ImageRecord };
type Page = { id: string; name: string; shortDescription: string; overview: string; sources: Source[]; image?: ImageRecord; alert?: Alert };

const placeholder: ImageRecord = {
  localPath: "/media/park-image-placeholder.png", width: 1536, height: 1024,
  alt: "Illustration of a landscaped hillside park with a curving path, trees, benches, and bay water under coastal fog.",
  attribution: "Placeholder illustration", filePageUrl: "", licenseId: "Project asset", licenseUrl: "/about/"
};

function Picture({ image, sizes }: { image?: ImageRecord; sizes: string }) {
  const selected = image ?? placeholder;
  const delivered = resolveMediaAsset(selected.localPath, selected.width, selected.height);
  return <img src={delivered.src} srcSet={delivered.srcSet} sizes={sizes} width={delivered.width} height={delivered.height} alt={selected.alt} />;
}

function Credit({ image }: { image?: ImageRecord }) {
  const selected = image ?? placeholder;
  return <p className="app-place-image-credit">{selected.filePageUrl ? <a href={selected.filePageUrl} rel="external">{selected.attribution} <span aria-hidden="true">↗</span></a> : selected.attribution} · <a href={selected.licenseUrl} rel="license">{selected.licenseId}</a></p>;
}

export function PlaceTiles({ heading, tiles }: { heading: string; tiles: Tile[] }) {
  return <section className="app-place-children" aria-labelledby="place-children-title"><h2 id="place-children-title">{heading}</h2><div className="app-place-grid">{tiles.map((tile) => <article className="app-place-card" key={tile.id}>
    <Link className="app-place-card__image" href={tile.href}><Picture image={tile.image} sizes="(max-width: 42rem) 100vw, (max-width: 70rem) 50vw, 33vw" /></Link>
    <div className="app-place-card__body"><h3><Link href={tile.href}>{tile.name}</Link></h3><p>{tile.shortDescription}</p></div>
    <Credit image={tile.image} />
  </article>)}</div></section>;
}

export function PlaceLanding({ eyebrow, page, photoHref, children }: { eyebrow: string; page: Page; photoHref?: string; children: React.ReactNode }) {
  const activeAlert = page.alert ? getActiveParkNotice({ alerts: [page.alert] }, page.alert.destinationId) : undefined;
  return <article className="app-place-landing"><header className="app-place-header"><div><p className="app-eyebrow">{eyebrow}</p><h1>{page.name}</h1><p className="app-lede">{page.shortDescription}</p></div><figure><div className="app-place-header__image"><Picture image={page.image} sizes="(max-width: 48rem) 100vw, 44vw" /></div><figcaption><Credit image={page.image} /></figcaption></figure></header>
    <section className="app-place-overview" aria-labelledby="place-overview-title"><h2 id="place-overview-title">About this area</h2><p>{page.overview}</p><div className="app-place-overview__actions"><PlaceSourceDialog name={page.name} sources={page.sources} />{photoHref ? <Link className="usa-button usa-button--outline" href={photoHref}>Browse photos from this {eyebrow.toLocaleLowerCase()}</Link> : null}</div></section>
    {activeAlert ? <ParkAlert notice={activeAlert} /> : null}
    {children}
  </article>;
}
