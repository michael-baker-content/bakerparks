let state, parkId, imageDrafts = [], blogSlug, blogCoverDraft = "", blogGalleryDraft = [], blogArchiveQuery = "", blogArchiveScope = "all", blogArchiveLimit = 20, placeKey, placeChildren = [], placeImageQuery = "", placeImageLimit = 20;
const workspace = document.querySelector("#workspace"), status = document.querySelector("#status");
const escape = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const message = (value, error = false) => { status.textContent = value; status.classList.toggle("error", error); };
async function load() { const result = await fetch("/api/state"); if (!result.ok) throw new Error("Could not load the local editor."); state = await result.json(); }
async function save(path, value) {
  message("Saving…");
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json", "X-Admin-Token": state.token }, body: JSON.stringify(value) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  await load();
  message("Saved to project files. Build and deploy when you want the live site updated.");
  return result;
}
function field(label, name, value = "", kind = "input") { return `<label>${escape(label)}${kind === "input" ? `<input name="${name}" value="${escape(value)}">` : `<textarea name="${name}">${escape(value)}</textarea>`}</label>`; }
function catchErrors(action) { return async (event) => { event?.preventDefault(); const button = event?.submitter; if (button) button.disabled = true; try { await action(event); } catch (error) { message(error.message, true); } finally { if (button) button.disabled = false; } }; }
const sections = { parks: renderPark, places: renderPlacePages, blogs: renderBlogs };
function setTab(selected) {
  for (const id of Object.keys(sections)) document.querySelector(`#${id}-tab`).setAttribute("aria-pressed", String(id === selected));
  document.title = `${document.querySelector(`#${selected}-tab`).textContent} · Local Parks editor`;
}
function selectedSection() {
  const section = window.location.hash.replace(/^#/, "");
  return Object.hasOwn(sections, section) ? section : "parks";
}
function renderSelectedSection() { sections[selectedSection()](); }
function navigateSection(section) {
  const hash = `#${section}`;
  if (window.location.hash === hash) renderSelectedSection();
  else window.location.hash = hash;
}
function renderPark() {
  setTab("parks");
  parkId ||= state.parks[0].id;
  const park = state.parks.find((item) => item.id === parkId);
  const evergreen = state.evergreen.find((item) => item.destinationId === parkId);
  const notice = state.notices.find((item) => item.destinationId === parkId) ?? {};
  const coordinateTarget = park.principalFacilityIds?.[0] ? { entityType: "facility", entityId: park.principalFacilityIds[0] } : { entityType: "property", entityId: park.propertyIds?.[0] };
  const coordinateOverride = state.coordinateOverrides.find((item) => item.entityType === coordinateTarget.entityType && item.entityId === coordinateTarget.entityId) ?? {};
  imageDrafts = structuredClone(state.images.filter((image) => image.destinationId === parkId).sort((a, b) => a.position - b.position));
  workspace.innerHTML = `<label>Choose a park<select id="park-select">${state.parks.map((item) => `<option value="${escape(item.id)}" ${item.id === parkId ? "selected" : ""}>${escape(item.publicName)}</option>`).join("")}</select></label><h2>${escape(park.publicName)}</h2>
    <details><summary>Review official and evergreen content (read-only)</summary><h3>About this place</h3><p>${escape(evergreen?.overview?.text || "No reviewed overview.")}</p><pre>${escape(JSON.stringify(evergreen ?? {}, null, 2))}</pre><h3>Official inventory, amenities, map point, and source links</h3><pre>${escape(JSON.stringify(park, null, 2))}</pre><p class="hint">Transit remains sourced from the imported 511 dataset. It is not editable here.</p></details>
    <section class="map-override"><h3>Map position override</h3><p>Current public map point: <strong>${escape(park.displayPoint?.latitude)}, ${escape(park.displayPoint?.longitude)}</strong></p><p class="hint">This park uses source ${escape(coordinateTarget.entityType)} ${escape(coordinateTarget.entityId)}. Paste a full Google Maps place link. The editor uses the place pin coordinates when the link also contains different viewport coordinates.</p><form id="coordinate-form"><label>Google Maps place link<input type="url" name="evidenceUrl" value="${escape(coordinateOverride.evidenceUrl)}" placeholder="https://www.google.com/maps/place/…" required></label>${field("Why the source point needs to be replaced", "reason", coordinateOverride.reason, "textarea")}${field("Reviewed by", "reviewedBy", coordinateOverride.reviewedBy || "project-owner")}<button>Save map override</button><p class="hint">Saving records the reviewed override and its evidence. Run <code>npm run build:data</code> afterward to update the public map, directions, search, and proximity data.</p></form></section>
    <section class="notice"><h3>Park notice</h3><form id="notice-form"><label class="check"><input type="checkbox" name="active" ${notice.active ? "checked" : ""}> Show this notice</label>${field("Title", "title", notice.title)}${field("Body", "body", notice.body, "textarea")}<label>Expiration date (optional, through end of day in San Francisco)<input type="date" name="expiresOn" value="${escape(notice.expiresOn)}"></label><button>Save notice</button></form></section>
    <section><h3>Page images</h3><p class="hint">Full-image previews. Choose one optional featured image for cards and other representative-image placements; gallery order remains separate. Without a featured choice, the first visible image is used. Hidden images remain in Blob and the catalog. Removing an image deletes its catalog entry but keeps its Blob file for recovery. Save image changes after editing.</p><form id="images-form"><div id="image-list"></div><button>Save image changes</button></form></section>
    <section><h3>Upload a photograph to Vercel Blob</h3><p class="hint">Uploads become public immediately. Only upload images you have permission to share. The site does not display them until deployment. Originals are not kept by this tool.</p><form id="upload-form"><label>Image file (JPEG, PNG, WebP; maximum 20 MB)<input type="file" name="file" accept="image/jpeg,image/png,image/webp" required></label>${field("Caption", "caption")}${field("Alt text", "alt")}${field("Creator", "creator", "Michael Baker")}${field("Attribution", "attribution", "Photo by Michael Baker")}${field("License ID", "licenseId", "CC-BY-4.0")}${field("License URL", "licenseUrl", "https://creativecommons.org/licenses/by/4.0/")}<label class="check"><input type="checkbox" name="permission" required> I have permission to publish this photograph under the specified license.</label><button>Upload & add to this park</button></form></section>`;
  document.querySelector("#park-select").addEventListener("change", (event) => { parkId = event.target.value; renderPark(); });
  document.querySelector("#notice-form button").insertAdjacentHTML("beforebegin", `<label>More information URL (optional)<input type="url" name="url" value="${escape(notice.url)}" placeholder="https://sfrecpark.org/…"></label>${field("URL display text (optional)", "urlText", notice.urlText)}<p class="hint">Link to the official notice or another relevant web page. Display text defaults to the URL. Leave the URL blank to hide the entire More Information section.</p>`);
  workspace.querySelector("details").insertAdjacentHTML("beforeend", `<h3>Nearby transit (read-only)</h3><pre>${escape(JSON.stringify(state.nearbyTransit[parkId], null, 2))}</pre>`);
  renderImages();
  document.querySelector("#notice-form").addEventListener("submit", catchErrors(async (event) => { const values = Object.fromEntries(new FormData(event.target)); await save("/api/notices", { ...values, active: event.target.elements.active.checked, destinationId: parkId }); }));
  document.querySelector("#coordinate-form").addEventListener("submit", catchErrors(async (event) => { const values = Object.fromEntries(new FormData(event.target)); await save("/api/coordinates", { ...values, destinationId: parkId }); renderPark(); }));
  document.querySelector("#images-form").addEventListener("submit", catchErrors(async () => { await save("/api/images", { destinationId: parkId, images: imageDrafts }); renderPark(); }));
  document.querySelector("#upload-form").addEventListener("submit", catchErrors(async (event) => {
    const values = Object.fromEntries(new FormData(event.target)), file = values.file;
    if (!file.size || file.size > 20 * 1024 * 1024) throw new Error("Choose a non-empty photograph under 20 MB.");
    const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(",")[1]); reader.onerror = reject; reader.readAsDataURL(file); });
    delete values.file;
    await save("/api/upload", { ...values, filename: file.name, base64, destinationId: parkId });
    renderPark();
  }));
}
function renderImages() {
  const list = document.querySelector("#image-list");
  const originalCount = state.images.filter((image) => image.destinationId === parkId).length;
  const cards = imageDrafts.length ? imageDrafts.map((image, index) => {
    const asset = state.blobAssets.find((item) => item.localPath === image.localPath);
    const src = asset?.variants?.at(-1)?.url ?? image.imageUrl;
    return `<div class="image-card${image.featured === true ? " image-card--featured" : ""}" data-index="${index}"><h4>Image ${index + 1}${image.featured === true ? " — featured" : ""}${image.visible === false ? " — hidden" : ""}</h4><div class="preview"><img src="${escape(src)}" alt="${escape(image.alt)}"></div><p class="hint">${escape(image.originalFilename || image.commonsFileTitle || image.localPath)} · ${escape(image.sourceType || "wikimedia-commons")}</p><div class="actions"><button type="button" class="secondary move" data-offset="-1" ${index === 0 ? "disabled" : ""} aria-label="Move image ${index + 1} up">↑ Move up</button><button type="button" class="secondary move" data-offset="1" ${index === imageDrafts.length - 1 ? "disabled" : ""} aria-label="Move image ${index + 1} down">↓ Move down</button><button type="button" class="danger remove-image">Remove image</button><a href="${escape(image.filePageUrl)}" target="_blank" rel="noopener noreferrer">Source image ↗</a></div><div class="image-card__choices"><label class="check"><input type="checkbox" name="visible" ${image.visible !== false ? "checked" : ""}> Visible on the site</label><label class="check"><input class="featured-image" type="checkbox" name="featured" ${image.featured === true ? "checked" : ""}> Use as featured image</label></div>${field("Caption", "caption", image.caption, "textarea")}${field("Alt text", "alt", image.alt, "textarea")}<div class="grid">${field("Creator", "creator", image.creator)}${field("Attribution", "attribution", image.attribution)}</div>${image.sourceType === "project-original" ? `<div class="grid">${field("License ID", "licenseId", image.licenseId)}${field("License URL", "licenseUrl", image.licenseUrl)}</div>` : `<p>Source license (read-only): <a href="${escape(image.licenseUrl)}">${escape(image.licenseId)}</a></p>`}</div>`;
  }).join("") : "<p>No location photographs yet. Upload one below.</p>";
  const removalCount = originalCount - imageDrafts.length;
  list.innerHTML = `${cards}${removalCount ? `<p class="removal-warning" role="status">${removalCount} image${removalCount === 1 ? "" : "s"} will be removed from the catalog when you save. The Blob file${removalCount === 1 ? "" : "s"} will remain available for recovery.</p>` : ""}`;
  list.querySelectorAll("input,textarea").forEach((input) => input.addEventListener("input", () => {
    const index = Number(input.closest(".image-card").dataset.index);
    imageDrafts[index][input.name] = input.type === "checkbox" ? input.checked : input.value;
    if (input.name === "featured") {
      if (input.checked) imageDrafts.forEach((draft, draftIndex) => { draft.featured = draftIndex === index; });
      imageDrafts[index].visible = true;
      renderImages();
      list.querySelector(`[data-index="${index}"] .featured-image`)?.focus();
    } else if (input.name === "visible" && !input.checked && imageDrafts[index].featured === true) {
      imageDrafts[index].featured = false;
      renderImages();
      list.querySelector(`[data-index="${index}"] input[name="visible"]`)?.focus();
    }
  }));
  list.querySelectorAll(".move").forEach((button) => button.addEventListener("click", () => { const index = Number(button.closest(".image-card").dataset.index), target = index + Number(button.dataset.offset); [imageDrafts[index], imageDrafts[target]] = [imageDrafts[target], imageDrafts[index]]; renderImages(); list.querySelector(`[data-index="${target}"] .move`)?.focus(); }));
  list.querySelectorAll(".remove-image").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.closest(".image-card").dataset.index), image = imageDrafts[index];
    if (!window.confirm(`Remove “${image.caption}” from the image catalog? The public Blob file will not be deleted. Select Save image changes to apply the removal.`)) return;
    imageDrafts.splice(index, 1);
    renderImages();
    document.querySelector("#images-form > button")?.focus();
  }));
}
function yamlText(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";
  try { return JSON.parse(trimmed); } catch { return trimmed.replace(/^['"]|['"]$/g, ""); }
}
function galleryFromMarkdown(markdown = "") {
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) return [];
  const lines = frontmatter.split(/\r?\n/), start = lines.findIndex((line) => /^gallery:\s*$/.test(line));
  if (start < 0) return [];
  const slides = [];
  for (let index = start + 1; index < lines.length && (/^\s/.test(lines[index]) || !lines[index].trim()); index += 1) {
    const legacy = lines[index].match(/^\s+-\s+(\/media\/\S+)\s*$/);
    const path = lines[index].match(/^\s+-\s+path:\s*(.+?)\s*$/);
    if (legacy) slides.push({ path: yamlText(legacy[1]), captionMode: "database", caption: "" });
    else if (path) slides.push({ path: yamlText(path[1]), captionMode: "database", caption: "" });
    else if (slides.length) {
      const mode = lines[index].match(/^\s+captionMode:\s*(.+?)\s*$/);
      const caption = lines[index].match(/^\s+caption:\s*(.+?)\s*$/);
      if (mode) slides.at(-1).captionMode = yamlText(mode[1]);
      if (caption) slides.at(-1).caption = yamlText(caption[1]);
    }
  }
  return slides;
}
function coverFromMarkdown(markdown = "") {
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) return "";
  const lines = frontmatter.split(/\r?\n/), start = lines.findIndex((line) => /^image:\s*$/.test(line));
  if (start < 0) return "";
  for (let index = start + 1; index < lines.length && /^\s/.test(lines[index]); index += 1) {
    const path = lines[index].match(/^\s+path:\s*(.+?)\s*$/);
    if (path) return yamlText(path[1]);
  }
  return "";
}
function replaceFrontmatterBlock(markdown, key, replacement) {
  const lines = String(markdown).replaceAll("\r\n", "\n").split("\n");
  if (lines[0] !== "---") throw new Error("Blog Markdown must begin with YAML frontmatter.");
  let end = lines.indexOf("---", 1);
  if (end < 0) throw new Error("Blog frontmatter must end with ---. ");
  const start = lines.slice(1, end).findIndex((line) => new RegExp(`^${key}:\\s*$`).test(line));
  if (start >= 0) {
    const absoluteStart = start + 1;
    let absoluteEnd = absoluteStart + 1;
    while (absoluteEnd < end && (/^\s/.test(lines[absoluteEnd]) || !lines[absoluteEnd].trim())) absoluteEnd += 1;
    lines.splice(absoluteStart, absoluteEnd - absoluteStart);
    end = lines.indexOf("---", 1);
  }
  if (replacement.length) lines.splice(end, 0, ...replacement);
  return lines.join("\n");
}
function markdownWithGallery(markdown, slides) {
  const gallery = [];
  if (slides.length) {
    gallery.push("gallery:");
    for (const slide of slides) {
      gallery.push(`  - path: ${JSON.stringify(slide.path)}`, `    captionMode: ${slide.captionMode}`);
      if (slide.captionMode === "custom") gallery.push(`    caption: ${JSON.stringify(String(slide.caption ?? "").trim())}`);
    }
  }
  return `${replaceFrontmatterBlock(markdown, "gallery", gallery).replace(/\n*$/, "")}\n`;
}
function markdownWithCover(markdown, path) {
  const image = state.images.find((item) => item.localPath === path);
  const block = image ? ["image:", `  path: ${JSON.stringify(image.localPath)}`, `  alt: ${JSON.stringify(image.alt)}`] : [];
  return replaceFrontmatterBlock(markdown, "image", block);
}
function blogImageSource(image) {
  return state.blobAssets.find((item) => item.localPath === image.localPath)?.variants?.at(-1)?.url ?? image.imageUrl;
}
function blogThumbnailSource(image) {
  return state.blobAssets.find((item) => item.localPath === image.localPath)?.variants?.[0]?.url ?? image.imageUrl;
}
function updateWithTransition(action) {
  if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(action);
  else action();
}
function addBlogSlide(path) {
  if (!path || blogGalleryDraft.some((slide) => slide.path === path)) return message("That image is already in this slideshow.", true);
  updateWithTransition(() => {
    blogGalleryDraft.push({ path, captionMode: "database", caption: "" });
    renderBlogGallery();
  });
  message("Image added to the unsaved slideshow.");
}
function setBlogCover(path) {
  blogCoverDraft = path;
  updateWithTransition(() => { renderBlogCover(); renderBlogArchive(); });
  message(path ? "Cover selected. Save the blog post to apply it." : "The default blog cover will be used after saving.");
}
function renderBlogCover() {
  const container = document.querySelector("#blog-cover-choice");
  if (!container) return;
  const image = state.images.find((item) => item.localPath === blogCoverDraft);
  container.innerHTML = image ? `<div class="media-choice"><img src="${escape(blogThumbnailSource(image))}" alt="${escape(image.alt)}"><div><p class="media-scope">Selected cover</p><strong>${escape(image.caption)}</strong><p class="hint"><code>${escape(image.localPath)}</code></p><button type="button" class="secondary" id="clear-blog-cover">Use default cover</button></div></div>` : `<div class="media-choice media-choice--empty"><p><strong>Default cover image</strong><br><span class="hint">Choose “Set as cover” on an archive tile to replace it.</span></p></div>`;
  container.querySelector("#clear-blog-cover")?.addEventListener("click", () => setBlogCover(""));
}
function matchingBlogArchiveImages() {
  const query = blogArchiveQuery.trim().toLowerCase();
  return state.images.filter((image) => image.visible !== false)
    .filter((image) => blogArchiveScope === "all" || (blogArchiveScope === "blog" ? image.usageScope === "blog" : image.usageScope !== "blog"))
    .filter((image) => !query || [image.caption, image.alt, image.creator, image.destinationId, image.originalFilename, image.localPath].some((value) => String(value ?? "").toLowerCase().includes(query)))
    .sort((a, b) => imageLabel(a).localeCompare(imageLabel(b)));
}
function openBlogImagePreview(path) {
  const image = state.images.find((item) => item.localPath === path), dialog = document.querySelector("#blog-image-dialog"), content = document.querySelector("#blog-image-dialog-content");
  if (!image || !dialog || !content) return;
  const selected = blogGalleryDraft.some((slide) => slide.path === path);
  content.innerHTML = `<div class="media-dialog__image"><img src="${escape(blogImageSource(image))}" alt="${escape(image.alt)}"></div><div class="media-dialog__details"><p class="media-scope">${image.usageScope === "blog" ? "Blog-only image" : escape(image.destinationId)}</p><h3>${escape(image.caption)}</h3><dl><dt>Alternative text</dt><dd>${escape(image.alt)}</dd><dt>Creator and credit</dt><dd>${escape(image.creator)} · ${escape(image.attribution)}</dd><dt>Dimensions</dt><dd>${escape(image.width)} × ${escape(image.height)} pixels</dd><dt>Archive path</dt><dd><code>${escape(image.localPath)}</code></dd></dl><p><a href="${escape(image.filePageUrl)}" target="_blank" rel="noopener noreferrer">Open source image ↗</a> · <a href="${escape(image.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(image.licenseId)} ↗</a></p><div class="actions"><button type="button" id="dialog-add-image" ${selected ? "disabled" : ""}>${selected ? "Already in slideshow" : "Add to slideshow"}</button><button type="button" class="secondary" id="dialog-set-cover" ${blogCoverDraft === path ? "disabled" : ""}>${blogCoverDraft === path ? "Current cover" : "Set as cover"}</button></div></div>`;
  content.querySelector("#dialog-add-image")?.addEventListener("click", () => { addBlogSlide(path); dialog.close(); });
  content.querySelector("#dialog-set-cover")?.addEventListener("click", () => { setBlogCover(path); dialog.close(); });
  dialog.showModal();
}
function renderBlogArchive() {
  const container = document.querySelector("#blog-image-archive"), count = document.querySelector("#blog-archive-count"), more = document.querySelector("#blog-archive-more");
  if (!container || !count || !more) return;
  const matches = matchingBlogArchiveImages(), images = matches.slice(0, blogArchiveLimit);
  count.textContent = `${images.length} of ${matches.length} image${matches.length === 1 ? "" : "s"} shown`;
  more.hidden = images.length >= matches.length;
  more.textContent = `Load ${Math.min(20, matches.length - images.length)} more`;
  container.innerHTML = images.length ? images.map((image) => {
    const selected = blogGalleryDraft.some((slide) => slide.path === image.localPath), cover = blogCoverDraft === image.localPath;
    const status = [selected ? "✓ Slideshow" : "", cover ? "✓ Cover" : ""].filter(Boolean).join(" · ") || "+ Add";
    return `<article class="media-tile${selected || cover ? " is-selected" : ""}"><button type="button" class="media-tile__select" data-path="${escape(image.localPath)}" aria-pressed="${selected}" aria-label="${selected ? "Already added: " : "Add to slideshow: "}${escape(image.caption)}"><span class="media-tile__image"><img src="${escape(blogThumbnailSource(image))}" alt="" loading="lazy" decoding="async"><span class="media-tile__status">${status}</span></span><span class="media-tile__caption">${escape(image.caption)}</span><span class="media-tile__meta">${image.usageScope === "blog" ? "Blog only" : escape(image.destinationId)}</span></button><div class="media-tile__actions"><button type="button" class="media-tile__cover secondary" data-path="${escape(image.localPath)}" ${cover ? "disabled" : ""}>${cover ? "Current cover" : "Set as cover"}</button><button type="button" class="media-tile__preview secondary" data-path="${escape(image.localPath)}">Details</button></div></article>`;
  }).join("") : `<p class="media-archive-empty">No images match this search and filter.</p>`;
  container.querySelectorAll(".media-tile__select").forEach((button) => button.addEventListener("click", () => addBlogSlide(button.dataset.path)));
  container.querySelectorAll(".media-tile__cover").forEach((button) => button.addEventListener("click", () => setBlogCover(button.dataset.path)));
  container.querySelectorAll(".media-tile__preview").forEach((button) => button.addEventListener("click", () => openBlogImagePreview(button.dataset.path)));
}
function renderBlogGallery() {
  const container = document.querySelector("#blog-gallery-list");
  if (!container) return;
  container.innerHTML = blogGalleryDraft.length ? blogGalleryDraft.map((slide, index) => {
    const image = state.images.find((item) => item.localPath === slide.path);
    if (!image) return `<div class="image-card" data-index="${index}"><p class="removal-warning">Missing archive image: ${escape(slide.path)}</p><button type="button" class="danger blog-remove">Remove slide</button></div>`;
    const custom = slide.captionMode === "custom";
    return `<div class="image-card" data-index="${index}"><h4>Slide ${index + 1}</h4><div class="preview"><img src="${escape(blogImageSource(image))}" alt="${escape(image.alt)}"></div><p><strong>${escape(image.caption)}</strong></p><p class="hint"><code>${escape(image.localPath)}</code>${image.usageScope === "blog" ? " · Blog only" : ` · ${escape(image.destinationId)}`}</p><div class="actions"><button type="button" class="secondary blog-move" data-offset="-1" ${index === 0 ? "disabled" : ""}>↑ Move up</button><button type="button" class="secondary blog-move" data-offset="1" ${index === blogGalleryDraft.length - 1 ? "disabled" : ""}>↓ Move down</button><button type="button" class="danger blog-remove">Remove slide</button></div><label>Visible caption<select class="blog-caption-mode"><option value="database" ${slide.captionMode === "database" ? "selected" : ""}>Use archive caption</option><option value="custom" ${custom ? "selected" : ""}>Use a custom caption</option><option value="none" ${slide.captionMode === "none" ? "selected" : ""}>No visible caption</option></select></label>${custom ? `<label>Custom caption<textarea class="blog-custom-caption">${escape(slide.caption)}</textarea></label>` : ""}<p class="hint">Creator and license credit remains visible in every mode.</p></div>`;
  }).join("") : "<p>No slideshow. Add at least two archive images to create one.</p>";
  container.querySelectorAll(".blog-move").forEach((button) => button.addEventListener("click", () => { const index = Number(button.closest(".image-card").dataset.index), target = index + Number(button.dataset.offset); [blogGalleryDraft[index], blogGalleryDraft[target]] = [blogGalleryDraft[target], blogGalleryDraft[index]]; renderBlogGallery(); container.querySelector(`[data-index="${target}"] .blog-move`)?.focus(); }));
  container.querySelectorAll(".blog-remove").forEach((button) => button.addEventListener("click", () => { blogGalleryDraft.splice(Number(button.closest(".image-card").dataset.index), 1); renderBlogGallery(); }));
  container.querySelectorAll(".blog-caption-mode").forEach((select) => select.addEventListener("change", () => { const slide = blogGalleryDraft[Number(select.closest(".image-card").dataset.index)]; slide.captionMode = select.value; if (select.value !== "custom") slide.caption = ""; renderBlogGallery(); }));
  container.querySelectorAll(".blog-custom-caption").forEach((textarea) => textarea.addEventListener("input", () => { blogGalleryDraft[Number(textarea.closest(".image-card").dataset.index)].caption = textarea.value; }));
  renderBlogArchive();
}
function renderBlogs() {
  setTab("blogs");
  const post = state.blogs.find((item) => item.slug === blogSlug) ?? state.blogs[0];
  blogSlug = post?.slug ?? "";
  blogCoverDraft = coverFromMarkdown(post?.markdown);
  blogGalleryDraft = galleryFromMarkdown(post?.markdown);
  blogArchiveLimit = 20;
  workspace.innerHTML = `<section><h2>Blog posts</h2><label>Choose a post<select id="blog-select">${state.blogs.map((item) => `<option ${item.slug === blogSlug ? "selected" : ""}>${escape(item.slug)}</option>`).join("")}</select></label><button type="button" class="secondary" id="new-blog">New post</button><form id="blog-form">${field("Filename / slug (no .md)", "slug", blogSlug)}<label>Full Markdown, including YAML frontmatter<textarea id="markdown" name="markdown" spellcheck="false">${escape(post?.markdown)}</textarea></label><p class="hint">Keep title, summary, and publishedAt frontmatter. Use the visual controls below for cover and gallery frontmatter; saving rewrites only those blocks.</p><fieldset><legend>Post cover image</legend><div id="blog-cover-choice"></div></fieldset><fieldset><legend>Post slideshow</legend><div id="blog-gallery-list"></div><div class="media-browser"><div class="media-browser__heading"><div><h3>Image archive</h3><p class="hint">Select a tile to add it, set it as the cover, or open the larger preview.</p></div><p id="blog-archive-count" class="media-count"></p></div><div class="media-browser__controls"><label>Search images<input type="search" id="blog-archive-search" value="${escape(blogArchiveQuery)}" placeholder="Park, caption, creator, or filename"></label><label>Image type<select id="blog-archive-scope"><option value="all" ${blogArchiveScope === "all" ? "selected" : ""}>All archive images</option><option value="park" ${blogArchiveScope === "park" ? "selected" : ""}>Park images</option><option value="blog" ${blogArchiveScope === "blog" ? "selected" : ""}>Blog-only images</option></select></label></div><div id="blog-image-archive" class="media-archive-grid"></div><button type="button" class="secondary media-archive-more" id="blog-archive-more">Load 20 more</button></div></fieldset><button>Save blog post, cover & slideshow</button></form></section><section><h3>Upload a blog-only photograph</h3><p class="hint">The photograph is added to the shared archive and Vercel Blob, but is excluded from park, area, and neighborhood imagery. After upload it is added to this unsaved slideshow.</p><form id="blog-upload-form"><label>Image file (JPEG, PNG, WebP; maximum 20 MB)<input type="file" name="file" accept="image/jpeg,image/png,image/webp" required></label>${field("Archive caption", "caption")}${field("Alt text", "alt")}${field("Creator", "creator", "Michael Baker")}${field("Attribution", "attribution", "Photo by Michael Baker")}${field("License ID", "licenseId", "CC-BY-4.0")}${field("License URL", "licenseUrl", "https://creativecommons.org/licenses/by/4.0/")}<label class="check"><input type="checkbox" name="permission" required> I have permission to publish this photograph under the specified license.</label><button>Upload and add to slideshow</button></form></section><dialog id="blog-image-dialog" class="media-dialog"><div class="media-dialog__bar"><strong>Archive image</strong><button type="button" class="secondary" id="close-blog-image-dialog">Close</button></div><div id="blog-image-dialog-content" class="media-dialog__content"></div></dialog>`;
  renderBlogCover();
  renderBlogGallery();
  document.querySelector("#blog-select").addEventListener("change", (event) => { blogSlug = event.target.value; renderBlogs(); });
  document.querySelector("#new-blog").addEventListener("click", () => { const form = document.querySelector("#blog-form"); blogCoverDraft = ""; blogGalleryDraft = []; form.elements.slug.value = ""; form.elements.markdown.value = `---\ntitle: New park update\nsummary: A short description of this update.\npublishedAt: ${new Date().toISOString().slice(0, 10)}\n---\n\nWrite your post here.\n`; renderBlogCover(); renderBlogGallery(); form.elements.slug.focus(); });
  document.querySelector("#blog-archive-search").addEventListener("input", (event) => { blogArchiveQuery = event.target.value; blogArchiveLimit = 20; renderBlogArchive(); });
  document.querySelector("#blog-archive-scope").addEventListener("change", (event) => { blogArchiveScope = event.target.value; blogArchiveLimit = 20; renderBlogArchive(); });
  document.querySelector("#blog-archive-more").addEventListener("click", () => { blogArchiveLimit += 20; renderBlogArchive(); });
  document.querySelector("#close-blog-image-dialog").addEventListener("click", () => document.querySelector("#blog-image-dialog").close());
  document.querySelector("#blog-image-dialog").addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  document.querySelector("#blog-form").addEventListener("submit", catchErrors(async (event) => { if (blogGalleryDraft.length === 1) throw new Error("A slideshow requires at least two images."); if (blogGalleryDraft.some((slide) => slide.captionMode === "custom" && !slide.caption.trim())) throw new Error("Enter each custom slideshow caption before saving."); const values = Object.fromEntries(new FormData(event.target)); values.markdown = markdownWithGallery(markdownWithCover(values.markdown, blogCoverDraft), blogGalleryDraft); await save("/api/blogs", values); blogSlug = values.slug; renderBlogs(); }));
  document.querySelector("#blog-upload-form").addEventListener("submit", catchErrors(async (event) => { const values = Object.fromEntries(new FormData(event.target)), file = values.file; if (!file.size || file.size > 20 * 1024 * 1024) throw new Error("Choose a non-empty photograph under 20 MB."); const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(",")[1]); reader.onerror = reject; reader.readAsDataURL(file); }); delete values.file; const result = await save("/api/blog-upload", { ...values, filename: file.name, base64 }); blogGalleryDraft.push({ path: result.image.localPath, captionMode: "database", caption: "" }); renderBlogGallery(); event.target.reset(); }));
}
function imageLabel(image) { return `${image.caption} — ${image.usageScope === "blog" ? "Blog only" : image.destinationId}`; }
function placeArchiveImages() {
  const query = placeImageQuery.trim().toLowerCase();
  return state.images.filter((image) => image.visible !== false && image.usageScope !== "blog")
    .filter((image) => !query || [image.caption, image.alt, image.creator, image.destinationId, image.originalFilename, image.localPath].some((value) => String(value ?? "").toLowerCase().includes(query)))
    .sort((a, b) => imageLabel(a).localeCompare(imageLabel(b)));
}
function renderPlaceImageChoice() {
  const container = document.querySelector("#place-image-choice"), input = document.querySelector("#place-image-path");
  if (!container || !input) return;
  const image = state.images.find((item) => item.localPath === input.value);
  container.innerHTML = image ? `<div class="media-choice"><img src="${escape(blogThumbnailSource(image))}" alt="${escape(image.alt)}"><div><p class="media-scope">Selected landing-page image</p><strong>${escape(image.caption)}</strong><p class="hint"><code>${escape(image.localPath)}</code></p></div></div>` : `<div class="media-choice media-choice--empty"><p><strong>Automatic representative image</strong><br><span class="hint">The highest-priority eligible child-park photograph will be used.</span></p></div>`;
}
function renderPlaceImageArchive() {
  const container = document.querySelector("#place-image-archive"), count = document.querySelector("#place-image-count"), more = document.querySelector("#place-image-more");
  if (!container || !count || !more) return;
  const matches = placeArchiveImages(), images = matches.slice(0, placeImageLimit), selected = document.querySelector("#place-image-path")?.value;
  count.textContent = `${images.length} of ${matches.length} image${matches.length === 1 ? "" : "s"} shown`;
  more.hidden = images.length >= matches.length;
  more.textContent = `Load ${Math.min(20, matches.length - images.length)} more`;
  container.innerHTML = images.length ? images.map((image) => `<article class="media-tile${selected === image.localPath ? " is-selected" : ""}"><button type="button" class="media-tile__select place-image-select" data-path="${escape(image.localPath)}" aria-pressed="${selected === image.localPath}" aria-label="Use for this landing page: ${escape(image.caption)}"><span class="media-tile__image"><img src="${escape(blogThumbnailSource(image))}" alt="" loading="lazy" decoding="async"><span class="media-tile__status">${selected === image.localPath ? "✓ Selected" : "Choose"}</span></span><span class="media-tile__caption">${escape(image.caption)}</span><span class="media-tile__meta">${escape(image.destinationId)}</span></button></article>`).join("") : `<p class="media-archive-empty">No park images match this search.</p>`;
  container.querySelectorAll(".place-image-select").forEach((button) => button.addEventListener("click", () => {
    document.querySelector("#place-image-path").value = button.dataset.path;
    renderPlaceImageChoice();
    document.querySelector("#place-image-dialog").close();
  }));
}
function renderPlacePages() {
  setTab("places");
  placeKey ||= `${state.placePages[0].type}:${state.placePages[0].id}`;
  const page = state.placePages.find((item) => `${item.type}:${item.id}` === placeKey) ?? state.placePages[0];
  placeKey = `${page.type}:${page.id}`;
  placeChildren = structuredClone(page.children);
  const sources = page.sources.map((source) => `${source.title} | ${source.url}`).join("\n");
  const alert = page.alert ?? {};
  const pageOptions = state.placePages.map((item) => { const key = `${item.type}:${item.id}`; return `<option value="${escape(key)}" ${key === placeKey ? "selected" : ""}>${escape(item.type === "area" ? `Area: ${item.name}` : `Neighborhood: ${item.name}`)}</option>`; }).join("");
  workspace.innerHTML = `<label>Choose an area or neighborhood<select id="place-select">${pageOptions}</select></label><h2>${escape(page.name)}</h2>
    <section><h3>Landing-page content</h3><form id="place-form"><p><strong>Page name:</strong> ${escape(page.name)} <span class="hint">(set by the filter taxonomy)</span></p><label>Short tile description (110 characters maximum)<input name="shortDescription" maxlength="110" value="${escape(page.shortDescription)}" required></label>${field("General introduction", "overview", page.overview, "textarea")}<fieldset><legend>Landing-page image</legend><input type="hidden" id="place-image-path" name="imagePath" value="${escape(page.imagePath)}"><div id="place-image-choice"></div><div class="actions"><button type="button" class="secondary" id="browse-place-images">Browse park images</button><button type="button" class="secondary" id="clear-place-image">Choose automatically</button></div></fieldset><label>Wiki sources — one per line as Title | https://address<textarea name="sources" required>${escape(sources)}</textarea></label>
    <fieldset><legend>Optional current alert</legend><label class="check"><input type="checkbox" name="alertActive" ${alert.active ? "checked" : ""}> Show this alert</label>${field("Alert title", "alertTitle", alert.title)}${field("Alert body", "alertBody", alert.body, "textarea")}<label>Expiration date (optional)<input type="date" name="alertExpiresOn" value="${escape(alert.expiresOn)}"></label><label>More information URL (optional)<input type="url" name="alertUrl" value="${escape(alert.url)}"></label>${field("URL display text (optional)", "alertUrlText", alert.urlText)}</fieldset>
    <fieldset><legend>${page.type === "area" ? "Neighborhood tiles" : "Park tiles"}</legend><p class="hint">Move tiles to set their order. Hidden tiles remain editable but do not appear on the live landing page.</p><div id="place-children"></div></fieldset><button>Save landing page</button></form></section><dialog id="place-image-dialog" class="media-dialog media-dialog--archive"><div class="media-dialog__bar"><strong>Choose a landing-page image</strong><button type="button" class="secondary" id="close-place-image-dialog">Close</button></div><div class="media-dialog__archive"><div class="media-browser__heading"><label>Search park images<input type="search" id="place-image-search" value="${escape(placeImageQuery)}" placeholder="Park, caption, creator, or filename"></label><p id="place-image-count" class="media-count"></p></div><div id="place-image-archive" class="media-archive-grid"></div><button type="button" class="secondary media-archive-more" id="place-image-more">Load 20 more</button></div></dialog>`;
  placeImageLimit = 20;
  renderPlaceImageChoice();
  const renderChildren = () => {
    const container = document.querySelector("#place-children");
    container.innerHTML = placeChildren.length ? placeChildren.map((child, index) => `<div class="tile-editor" data-index="${index}"><strong>${escape(child.name)}</strong><label class="check"><input type="checkbox" class="tile-visible" ${child.visible ? "checked" : ""}> Visible</label><div class="actions"><button type="button" class="secondary tile-move" data-offset="-1" ${index === 0 ? "disabled" : ""}>↑ Move up</button><button type="button" class="secondary tile-move" data-offset="1" ${index === placeChildren.length - 1 ? "disabled" : ""}>↓ Move down</button></div></div>`).join("") : "<p>No neighborhood filters belong to this area, so its park destinations are shown directly.</p>";
    container.querySelectorAll(".tile-visible").forEach((input) => input.addEventListener("change", () => { placeChildren[Number(input.closest(".tile-editor").dataset.index)].visible = input.checked; }));
    container.querySelectorAll(".tile-move").forEach((button) => button.addEventListener("click", () => { const index = Number(button.closest(".tile-editor").dataset.index), target = index + Number(button.dataset.offset); [placeChildren[index], placeChildren[target]] = [placeChildren[target], placeChildren[index]]; renderChildren(); container.querySelector(`[data-index="${target}"] .tile-move`)?.focus(); }));
  };
  renderChildren();
  document.querySelector("#browse-place-images").addEventListener("click", () => { placeImageLimit = 20; renderPlaceImageArchive(); document.querySelector("#place-image-dialog").showModal(); });
  document.querySelector("#clear-place-image").addEventListener("click", () => { document.querySelector("#place-image-path").value = ""; renderPlaceImageChoice(); });
  document.querySelector("#close-place-image-dialog").addEventListener("click", () => document.querySelector("#place-image-dialog").close());
  document.querySelector("#place-image-dialog").addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  document.querySelector("#place-image-search").addEventListener("input", (event) => { placeImageQuery = event.target.value; placeImageLimit = 20; renderPlaceImageArchive(); });
  document.querySelector("#place-image-more").addEventListener("click", () => { placeImageLimit += 20; renderPlaceImageArchive(); });
  document.querySelector("#place-select").addEventListener("change", (event) => { placeKey = event.target.value; renderPlacePages(); });
  document.querySelector("#place-form").addEventListener("submit", catchErrors(async (event) => { const values = Object.fromEntries(new FormData(event.target)); await save("/api/place-pages", { ...values, type: page.type, id: page.id, alertActive: event.target.elements.alertActive.checked, children: placeChildren.map(({ id, visible }) => ({ id, visible })) }); renderPlacePages(); }));
}
document.querySelector("#parks-tab").addEventListener("click", () => navigateSection("parks"));
document.querySelector("#places-tab").addEventListener("click", () => navigateSection("places"));
document.querySelector("#blogs-tab").addEventListener("click", () => navigateSection("blogs"));
window.addEventListener("hashchange", () => { if (state) renderSelectedSection(); });
try {
  await load();
  if (!window.location.hash || !Object.hasOwn(sections, window.location.hash.slice(1))) window.history.replaceState(null, "", "#parks");
  renderSelectedSection();
  message(`Loaded ${state.parks.length} park pages and ${state.images.length} photographs. No server credentials are exposed to this editor.`);
} catch (error) { message(error.message, true); }
