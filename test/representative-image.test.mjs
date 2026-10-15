import assert from "node:assert/strict";
import test from "node:test";
import { representativeDestinationImage, representativeDestinationImageMap } from "../src/lib/representative-image.js";

const images = [
  { destinationId: "park", localPath: "/media/first.jpg", position: 1 },
  { destinationId: "park", localPath: "/media/featured.jpg", position: 3, featured: true },
  { destinationId: "park", localPath: "/media/second.jpg", position: 2 },
  { destinationId: "other", localPath: "/media/hidden.jpg", position: 1, featured: true, visible: false },
  { destinationId: "other", localPath: "/media/visible.jpg", position: 2 },
];

test("a featured image takes precedence without changing gallery position", () => {
  assert.equal(representativeDestinationImage(images, "park").localPath, "/media/featured.jpg");
  assert.equal(representativeDestinationImageMap(images).get("park").localPath, "/media/featured.jpg");
});

test("hidden featured images cannot replace a visible fallback", () => {
  assert.equal(representativeDestinationImage(images, "other").localPath, "/media/visible.jpg");
});
