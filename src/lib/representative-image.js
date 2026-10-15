export function eligibleDestinationImages(images, destinationId) {
  return images
    .filter((image) => image.destinationId === destinationId && image.visible !== false && image.usageScope !== "blog")
    .sort((first, second) => Number(second.featured === true) - Number(first.featured === true) || first.position - second.position);
}

export function representativeDestinationImage(images, destinationId) {
  return eligibleDestinationImages(images, destinationId)[0];
}

export function representativeDestinationImageMap(images) {
  const selected = new Map();
  for (const image of images.filter((item) => item.visible !== false && item.usageScope !== "blog").sort((first, second) => Number(second.featured === true) - Number(first.featured === true) || first.position - second.position)) {
    if (!selected.has(image.destinationId)) selected.set(image.destinationId, image);
  }
  return selected;
}
