import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import pages from "../data/content/place-pages.json" with { type: "json" };
import filters from "../data/search/search-filters.json" with { type: "json" };
import { getAreas, getNeighborhoods, getParkBreadcrumbPaths, validatePlacePages } from "../src/lib/place-pages.js";

test("every populated area and neighborhood filter has a reviewed landing page", () => {
  assert.deepEqual(validatePlacePages(pages), []);
  assert.equal(getAreas().length, 9);
  assert.equal(getNeighborhoods().length, 41);
});

test("empty neighborhoods never become live landing pages or area tiles", () => {
  for (const neighborhood of getNeighborhoods()) assert.ok(neighborhood.destinationIds.length > 0);
  for (const area of getAreas()) {
    const configured = new Set(filters.areas.find((item) => item.id === area.id).neighborhoodLabels ?? []);
    for (const neighborhood of area.neighborhoods) assert.equal(configured.has(neighborhood.name), true);
  }
});

test("the outside-San-Francisco area falls back to its parks without inventing neighborhoods", () => {
  const area = getAreas().find((item) => item.id === "outside-san-francisco");
  assert.deepEqual(area.neighborhoods, []);
  assert.deepEqual(area.directDestinations.map((item) => item.id).sort(), ["camp-mather", "sharp-park"]);
});

test("park breadcrumbs preserve every valid neighborhood path and provide an area-only fallback", () => {
  assert.deepEqual(getParkBreadcrumbPaths("buchanan-st-mall").map((item) => item.neighborhoodId), ["hayes-valley", "western-addition"]);
  assert.deepEqual(getParkBreadcrumbPaths("camp-mather"), [{ areaId: "outside-san-francisco", areaName: "Outside San Francisco" }]);
});

test("wiki sources and boundary guidance are hidden in an accessible modal by default", async () => {
  const landing = await readFile(new URL("../components/PlaceLanding.tsx", import.meta.url), "utf8");
  const dialog = await readFile(new URL("../components/PlaceSourceDialog.tsx", import.meta.url), "utf8");
  assert.match(landing, /<PlaceSourceDialog/);
  assert.doesNotMatch(landing, /<aside>/);
  assert.match(dialog, /<dialog[^>]*aria-labelledby=/);
  assert.match(dialog, /showModal\(\)/);
  assert.match(dialog, /Neighborhood names and boundaries vary by source/);
  assert.match(dialog, />More information</);
});
