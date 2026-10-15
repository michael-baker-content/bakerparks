import { allBlogPosts } from "content-collections";
import destinations from "../../data/presentation/generated/destinations.json" with { type: "json" };
import media from "../../data/media/media-manifest.json" with { type: "json" };
import search from "../../data/search/generated/search-index.json" with { type: "json" };
import { resolveRequiredMediaAsset } from "./media-delivery.js";

const destinationsById = new Map(destinations.records.map((destination) => [destination.id, destination]));
const searchById = new Map(search.records.map((record) => [record.id, record]));

function galleryPath(slide) {
  return typeof slide === "string" ? slide : slide.path;
}

function blogReferences() {
  const references = new Map();
  for (const post of allBlogPosts) {
    const paths = [post.image?.path, ...(post.gallery ?? []).map(galleryPath)].filter(Boolean);
    for (const path of paths) {
      const posts = references.get(path) ?? [];
      if (!posts.some((item) => item.slug === post.slug)) posts.push({ slug: post.slug, title: post.title });
      references.set(path, posts);
    }
  }
  return references;
}

export function getPublicImageArchive() {
  const references = blogReferences();
  return media.images
    .filter((image) => image.visible !== false && (image.usageScope !== "blog" || references.has(image.localPath)))
    .map((image) => {
      const destination = destinationsById.get(image.destinationId);
      const searchRecord = searchById.get(image.destinationId);
      return {
        id: image.localPath,
        localPath: image.localPath,
        caption: image.caption,
        alt: image.alt,
        creator: image.creator,
        attribution: image.attribution,
        licenseId: image.licenseId,
        licenseUrl: image.licenseUrl,
        filePageUrl: image.filePageUrl,
        sourceType: image.sourceType ?? "wikimedia-commons",
        reviewedAt: image.reviewedAt,
        destination: destination ? { id: destination.id, name: destination.publicName, href: `/parks/${destination.id}/` } : undefined,
        blogPosts: references.get(image.localPath) ?? [],
        areaIds: searchRecord?.filters.areaIds ?? [],
        neighborhoodIds: searchRecord?.filters.neighborhoodIds ?? [],
        ...resolveRequiredMediaAsset(image.localPath),
      };
    })
    .sort((first, second) => second.reviewedAt.localeCompare(first.reviewedAt) || (first.destination?.name ?? first.caption).localeCompare(second.destination?.name ?? second.caption) || first.localPath.localeCompare(second.localPath));
}

export function getPublicImageArchiveOptions() {
  return {
    areas: search.facets.areas.filter((item) => item.count > 0).map(({ id, label }) => ({ id, label })),
    neighborhoods: search.facets.neighborhoods.filter((item) => item.count > 0).map(({ id, label }) => ({ id, label })),
  };
}
