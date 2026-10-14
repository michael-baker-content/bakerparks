import filters from "../../data/search/search-filters.json" with { type: "json" };
import search from "../../data/search/generated/search-index.json" with { type: "json" };
import content from "../../data/content/place-pages.json" with { type: "json" };
import destinations from "../../data/presentation/generated/destinations.json" with { type: "json" };
import media from "../../data/media/media-manifest.json" with { type: "json" };

const destinationsById = new Map(destinations.records.map((record) => [record.id, record]));
const visibleImages = media.images.filter((image) => image.visible !== false).sort((a, b) => a.position - b.position);

function ordered(items, record) {
  const positions = new Map((record.childOrder ?? []).map((id, index) => [id, index]));
  const hidden = new Set(record.hiddenChildIds ?? []);
  return items.filter((item) => !hidden.has(item.id)).sort((a, b) => (positions.get(a.id) ?? 9999) - (positions.get(b.id) ?? 9999) || a.name.localeCompare(b.name));
}

export function imageForPage(record, destinationIds = []) {
  if (record.imagePath) return visibleImages.find((image) => image.localPath === record.imagePath);
  return visibleImages.find((image) => destinationIds.includes(image.destinationId));
}

export function getNeighborhoods(document = content) {
  const contentByKey = new Map(document.records.map((record) => [`${record.type}:${record.id}`, record]));
  return search.facets.neighborhoods.filter((facet) => facet.count > 0).map((facet) => {
    const record = contentByKey.get(`neighborhood:${facet.id}`);
    if (!record) throw new Error(`Missing neighborhood page content for ${facet.id}.`);
    const destinationIds = search.records.filter((item) => item.filters.neighborhoodIds.includes(facet.id)).map((item) => item.id);
    return { ...record, destinationIds, image: imageForPage(record, destinationIds) };
  });
}

export function getAreas(document = content) {
  const contentByKey = new Map(document.records.map((record) => [`${record.type}:${record.id}`, record]));
  const neighborhoods = getNeighborhoods(document);
  return search.facets.areas.filter((facet) => facet.count > 0).map((facet) => {
    const record = contentByKey.get(`area:${facet.id}`);
    if (!record) throw new Error(`Missing area page content for ${facet.id}.`);
    const areaDestinationIds = search.records.filter((item) => item.filters.areaIds.includes(facet.id)).map((item) => item.id);
    const configuredLabels = new Set(filters.areas.find((item) => item.id === facet.id)?.neighborhoodLabels ?? []);
    const children = neighborhoods.filter((neighborhood) => configuredLabels.has(neighborhood.name));
    const directDestinations = children.length ? [] : areaDestinationIds.map((id) => destinationsById.get(id)).filter(Boolean);
    return { ...record, destinationIds: areaDestinationIds, neighborhoods: ordered(children, record), directDestinations: ordered(directDestinations.map((item) => ({ ...item, name: item.publicName })), record), image: imageForPage(record, areaDestinationIds) };
  });
}

export function getArea(id, document = content) { return getAreas(document).find((item) => item.id === id); }
export function getAreaForNeighborhood(neighborhoodId, document = content) {
  const neighborhood = getNeighborhoods(document).find((item) => item.id === neighborhoodId);
  if (!neighborhood) return undefined;
  const area = filters.areas.find((item) => (item.neighborhoodLabels ?? []).includes(neighborhood.name));
  return area ? getArea(area.id, document) : undefined;
}
export function getNeighborhood(id, document = content) {
  const neighborhood = getNeighborhoods(document).find((item) => item.id === id);
  if (!neighborhood) return undefined;
  const parks = neighborhood.destinationIds.map((id) => destinationsById.get(id)).filter(Boolean).map((park) => ({ ...park, name: park.publicName, image: visibleImages.find((image) => image.destinationId === park.id) }));
  return { ...neighborhood, parks: ordered(parks, neighborhood) };
}

export function getParkBreadcrumbPaths(destinationId, document = content) {
  const record = search.records.find((item) => item.id === destinationId);
  if (!record) return [];
  const neighborhoods = getNeighborhoods(document);
  const paths = record.filters.neighborhoodIds.flatMap((neighborhoodId) => {
    const neighborhood = neighborhoods.find((item) => item.id === neighborhoodId);
    const area = neighborhood ? getAreaForNeighborhood(neighborhood.id, document) : undefined;
    return neighborhood && area ? [{ areaId: area.id, areaName: area.name, neighborhoodId: neighborhood.id, neighborhoodName: neighborhood.name }] : [];
  });
  if (paths.length) return paths;
  return getAreas(document).filter((area) => area.destinationIds.includes(destinationId)).map((area) => ({ areaId: area.id, areaName: area.name }));
}

export function validatePlacePages(document = content) {
  const errors = [];
  if (document.schemaVersion !== 1 || !Array.isArray(document.records)) return ["Place pages must use schema version 1 and a records array."];
  const expected = new Set([...search.facets.areas.filter((item) => item.count > 0).map((item) => `area:${item.id}`), ...search.facets.neighborhoods.filter((item) => item.count > 0).map((item) => `neighborhood:${item.id}`)]);
  const seen = new Set();
  for (const record of document.records) {
    const key = `${record.type}:${record.id}`;
    if (!expected.has(key)) errors.push(`${key}: not a populated area or neighborhood filter.`);
    if (seen.has(key)) errors.push(`${key}: duplicate record.`);
    seen.add(key);
    if (!record.name?.trim() || !record.shortDescription?.trim() || record.shortDescription.length > 110 || !record.overview?.trim()) errors.push(`${key}: name, overview, and a short description of at most 110 characters are required.`);
    if (!Array.isArray(record.sources) || !record.sources.length) errors.push(`${key}: at least one wiki source is required.`);
    for (const source of record.sources ?? []) { try { const url = new URL(source.url); if (url.protocol !== "https:" || !source.title?.trim() || !["wikipedia.org", "wikidata.org", "localwiki.org"].some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`))) throw new Error(); } catch { errors.push(`${key}: sources require a title and an HTTPS Wikipedia, Wikidata, or LocalWiki URL.`); } }
    if (record.imagePath && !visibleImages.some((image) => image.localPath === record.imagePath)) errors.push(`${key}: imagePath is not a visible image in the media manifest.`);
    if (!Array.isArray(record.childOrder) || !Array.isArray(record.hiddenChildIds)) errors.push(`${key}: child order and hidden children must be arrays.`);
    if (record.alert) {
      if (typeof record.alert.active !== "boolean" || (record.alert.active && (!record.alert.title?.trim() || !record.alert.body?.trim()))) errors.push(`${key}: an active alert requires a title and body.`);
      if (record.alert.expiresOn && !/^\d{4}-\d{2}-\d{2}$/.test(record.alert.expiresOn)) errors.push(`${key}: alert expiration must use YYYY-MM-DD.`);
      if (record.alert.url) { try { const url = new URL(record.alert.url); if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error(); } catch { errors.push(`${key}: alert URL must be a safe complete web address.`); } }
    }
  }
  for (const key of expected) if (!seen.has(key)) errors.push(`${key}: missing content record.`);
  return errors;
}

export function pageAdminState(document = content) {
  const neighborhoods = getNeighborhoods(document);
  return document.records.map((record) => {
    const positions = new Map((record.childOrder ?? []).map((id, index) => [id, index]));
    const hidden = new Set(record.hiddenChildIds ?? []);
    let children;
    if (record.type === "area") {
      const areaDestinationIds = search.records.filter((item) => item.filters.areaIds.includes(record.id)).map((item) => item.id);
      const configuredLabels = new Set(filters.areas.find((item) => item.id === record.id)?.neighborhoodLabels ?? []);
      children = neighborhoods.filter((item) => configuredLabels.has(item.name)).map(({ id, name }) => ({ id, name }));
      if (!children.length) children = areaDestinationIds.map((id) => destinationsById.get(id)).filter(Boolean).map(({ id, publicName }) => ({ id, name: publicName }));
    } else children = search.records.filter((item) => item.filters.neighborhoodIds.includes(record.id)).map((item) => destinationsById.get(item.id)).filter(Boolean).map(({ id, publicName }) => ({ id, name: publicName }));
    children.sort((a, b) => (positions.get(a.id) ?? 9999) - (positions.get(b.id) ?? 9999) || a.name.localeCompare(b.name));
    return { ...record, children: children.map((item) => ({ ...item, visible: !hidden.has(item.id) })) };
  });
}
