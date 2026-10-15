"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type ArchiveImage = {
  id: string;
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  creator: string;
  attribution: string;
  licenseId: string;
  licenseUrl: string;
  filePageUrl: string;
  sourceType: string;
  destination?: { id: string; name: string; href: string };
  blogPosts: { slug: string; title: string }[];
  areaIds: string[];
  neighborhoodIds: string[];
};

type ArchiveOptions = { areas: { id: string; label: string }[]; neighborhoods: { id: string; label: string }[] };

const batchSize = 20;

function matches(image: ArchiveImage, query: string, source: string, area: string, neighborhood: string) {
  if (source === "original" && image.sourceType !== "project-original") return false;
  if (source === "licensed" && image.sourceType === "project-original") return false;
  if (area && !image.areaIds.includes(area)) return false;
  if (neighborhood && !image.neighborhoodIds.includes(neighborhood)) return false;
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return true;
  return [image.caption, image.alt, image.creator, image.destination?.name, ...image.blogPosts.map((post) => post.title)]
    .some((value) => value?.toLocaleLowerCase().includes(normalized));
}

export function ImageArchive({ images, options }: { images: ArchiveImage[]; options: ArchiveOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [limit, setLimit] = useState(batchSize);
  const [activeId, setActiveId] = useState<string>();
  const dialog = useRef<HTMLDialogElement>(null);
  const area = params.get("area") ?? "";
  const neighborhood = params.get("neighborhood") ?? "";
  const filtered = useMemo(() => images.filter((image) => matches(image, query, source, area, neighborhood)), [images, query, source, area, neighborhood]);
  const visible = filtered.slice(0, limit);
  const activeIndex = activeId ? filtered.findIndex((image) => image.id === activeId) : -1;
  const active = activeIndex >= 0 ? filtered[activeIndex] : undefined;

  useEffect(() => setLimit(batchSize), [query, source, area, neighborhood]);
  useEffect(() => {
    if (active && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [active]);

  const close = () => {
    dialog.current?.close();
    setActiveId(undefined);
  };
  const move = (offset: number) => {
    if (!filtered.length || activeIndex < 0) return;
    setActiveId(filtered[(activeIndex + offset + filtered.length) % filtered.length].id);
  };
  const setScope = (key: "area" | "neighborhood", value: string) => {
    const next = new URLSearchParams(params.toString());
    next.delete(key === "area" ? "neighborhood" : "area");
    if (value) next.set(key, value); else next.delete(key);
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };

  return <>
    <div className="app-image-archive__tools">
      <label className="usa-label" htmlFor="archive-search">Search photographs</label>
      <div className="app-image-archive__controls">
        <input className="usa-input" id="archive-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Park, place, caption, or photographer" />
        <div>
          <label className="usa-label" htmlFor="archive-source">Image source</label>
          <select className="usa-select" id="archive-source" value={source} onChange={(event) => setSource(event.target.value)}>
            <option value="all">All photographs</option>
            <option value="original">Project photography</option>
            <option value="licensed">Open-license sources</option>
          </select>
        </div>
        <div>
          <label className="usa-label" htmlFor="archive-area">Area</label>
          <select className="usa-select" id="archive-area" value={area} onChange={(event) => setScope("area", event.target.value)}>
            <option value="">All areas</option>
            {options.areas.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
          </select>
        </div>
        <div>
          <label className="usa-label" htmlFor="archive-neighborhood">Neighborhood</label>
          <select className="usa-select" id="archive-neighborhood" value={neighborhood} onChange={(event) => setScope("neighborhood", event.target.value)}>
            <option value="">All neighborhoods</option>
            {options.neighborhoods.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
          </select>
        </div>
      </div>
      <p className="app-image-archive__count" role="status" aria-live="polite">Showing {visible.length} of {filtered.length} {filtered.length === 1 ? "photograph" : "photographs"}</p>
    </div>

    {visible.length ? <div className="app-image-archive__grid">
      {visible.map((image) => <article className="app-image-archive__card" key={image.id}>
        <button className="app-image-archive__open" type="button" onClick={() => setActiveId(image.id)} aria-label={`View larger photograph: ${image.caption}`}>
          <img src={image.src} srcSet={image.srcSet} sizes="(max-width: 34rem) 100vw, (max-width: 64rem) 50vw, 25vw" width={image.width} height={image.height} alt="" loading="lazy" />
          <span aria-hidden="true">View larger</span>
        </button>
        <div className="app-image-archive__body">
          <h2>{image.destination ? <Link href={image.destination.href}>{image.destination.name}</Link> : image.blogPosts.length ? <Link href={`/blog/${image.blogPosts[0].slug}/`}>{image.blogPosts[0].title}</Link> : "Project photograph"}</h2>
          <p>{image.caption}</p>
        </div>
        <p className="app-image-archive__credit"><a href={image.filePageUrl} rel="external">{image.attribution} <span aria-hidden="true">↗</span></a> · <a href={image.licenseUrl} rel="license">{image.licenseId}</a></p>
      </article>)}
    </div> : <p className="app-image-archive__empty">No photographs match this search.</p>}

    {visible.length < filtered.length ? <button className="usa-button usa-button--outline app-image-archive__more" type="button" onClick={() => setLimit((current) => current + batchSize)}>Show {Math.min(batchSize, filtered.length - visible.length)} more</button> : null}

    <dialog ref={dialog} className="app-image-viewer" aria-labelledby="image-viewer-title" onClose={() => setActiveId(undefined)} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }}>
      {active ? <div className="app-image-viewer__panel">
        <div className="app-image-viewer__bar"><p>Photograph {activeIndex + 1} of {filtered.length}</p><button className="usa-button usa-button--outline" type="button" onClick={close}>Close</button></div>
        <figure>
          <div className="app-image-viewer__frame"><img src={active.src} srcSet={active.srcSet} sizes="(max-width: 72rem) 94vw, 70rem" width={active.width} height={active.height} alt={active.alt} /></div>
          <figcaption>
            <h2 id="image-viewer-title">{active.destination ? <Link href={active.destination.href}>{active.destination.name}</Link> : active.blogPosts.length ? <Link href={`/blog/${active.blogPosts[0].slug}/`}>{active.blogPosts[0].title}</Link> : "Project photograph"}</h2>
            <p>{active.caption}</p>
            <p className="app-image-viewer__credit"><a href={active.filePageUrl} rel="external">{active.attribution} <span aria-hidden="true">↗</span></a> · <a href={active.licenseUrl} rel="license">{active.licenseId}</a></p>
          </figcaption>
        </figure>
        <div className="app-image-viewer__controls">
          <button className="usa-button usa-button--outline" type="button" onClick={() => move(-1)}><span aria-hidden="true">←</span> Previous</button>
          <button className="usa-button usa-button--outline" type="button" onClick={() => move(1)}>Next <span aria-hidden="true">→</span></button>
        </div>
      </div> : null}
    </dialog>
  </>;
}
