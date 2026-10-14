"use client";

import { useRef } from "react";

type Source = { title: string; url: string };

export function PlaceSourceDialog({ name, sources }: { name: string; sources: Source[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button className="usa-button usa-button--outline app-place-information-button" type="button" onClick={() => dialog.current?.showModal()}>More information</button>
    <dialog className="app-place-information" ref={dialog} aria-labelledby="place-information-title" onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="app-place-information__panel">
        <div className="app-place-information__heading"><h2 id="place-information-title">More information about {name}</h2><button className="usa-button usa-button--outline" type="button" onClick={() => dialog.current?.close()}><span aria-hidden="true">×</span> Close</button></div>
        <h3>Wiki sources</h3>
        <ul>{sources.map((source) => <li key={source.url}><a href={source.url} rel="external">{source.title} <span aria-hidden="true">↗</span></a></li>)}</ul>
        <p className="usa-hint">Neighborhood names and boundaries vary by source. This site’s area groupings support browsing and are not official boundaries.</p>
      </div>
    </dialog>
  </>;
}
