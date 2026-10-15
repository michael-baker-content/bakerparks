# Baker Parks / SF Parks Explorer portfolio content brief

**Prepared:** October 14, 2026  
**Project:** SF Parks Explorer (referred to as “Baker Parks” in this brief)  
**Existing portfolio page:** None supplied  
**Repository:** [michael-baker-content/sf-parks](https://github.com/michael-baker-content/sf-parks)  
**Live product:** A Vercel deployment has been reported by the project owner, but its URL and parity with the current repository were not available for inspection  
**Scope:** Portfolio content only; no product or portfolio changes

---

## 1. Editorial direction

### Recommended central claim

SF Parks Explorer is an independent civic-information prototype that reorganizes fragmented public park data around the questions residents ask—what a place offers, where it is, how to reach it, and where to complete an official next step—without trying to replace the City of San Francisco’s authoritative services.

This is a defensible claim about the product’s design and implementation. It should not be upgraded to a claim that residents find parks faster or complete tasks more successfully until task-based research exists.

### Intended audience

**Inferred, not supplied:** hiring managers, clients, and collaborators in product design, content strategy, UX, service design, civic technology, and digital-program leadership. This inference comes from the project’s own case-study notes. Confirm the audience before publishing if the portfolio targets a narrower role.

### Recommended story

Lead with the translation problem, not the framework or data volume. The useful story is how an administrative collection of properties, facilities, assets, official pages, schedules, and external services became a resident-facing discovery system with explicit boundaries around uncertainty and authority.

The narrative should move through four layers:

1. A resident problem: park information and next steps are spread across systems built for different purposes.
2. A product boundary: improve discovery and comprehension, while keeping reservations, registration, and official policy in City systems.
3. A set of consequential decisions: governed normalization, resident-facing filters, cautious quantities and corrections, and sustainable editorial tools.
4. A candid status: a substantial working implementation exists, but user outcomes and the current public deployment still need independent validation.

### Goals, not outcomes

- Make park discovery understandable without requiring knowledge of municipal data structures.
- Support browsing by place, activity, amenity, geography, size, and transit access.
- Preserve provenance and communicate incomplete or uncertain information.
- Send residents to the appropriate official service for programs, permits, and reservations.
- Keep the public experience functional without generative-AI or per-query token costs.
- Make ongoing editorial maintenance possible without editing generated files directly.

### Personal contribution

The repository and media records support that Michael Baker is the repository owner and the credited photographer for 119 of the 132 current manifest entries. The project history also documents extensive product, content, data, interface, accessibility, and editorial-workflow decisions. It does **not** establish whether all implementation was completed alone, which tools assisted the work, or whether other people contributed design, development, research, or review.

**Before publication, confirm a role statement such as:**

> I led product strategy, content design, data modeling, interface design, and implementation for this independent project. [Add collaborators, advisors, and the role of development or AI-assisted tools as appropriate.]

---

## 2. Evidence and current status

| Status class | What the inspected materials support |
| --- | --- |
| Publicly available or delivered | A GitHub repository with project history and documentation is configured at the URL above. A Vercel deployment was reported, but the live URL and deployed revision were not supplied. |
| Implemented in the repository | A statically generated Next.js explorer; 249 destination records; search and shareable filters; nine area and 41 populated neighborhood landing records; MapLibre result mapping; Google Maps handoffs; build-time 511 transit data; destination pages; official program and reservation handoffs; a Markdown blog; a local-only editor; notice, image, and coordinate-override workflows. |
| Implemented content and media | The current manifest contains 132 image records across 58 destinations. It credits Michael Baker for 119 records and includes credited open-license sources for the remainder. The normalized transit file contains 3 agencies, 85 routes, and 3,314 stops or stations. |
| Work in progress | Manual screen-reader, keyboard-only, browser-zoom, physical-device, and task-based usability evaluation; alternate-source work for remaining content gaps; continued photography and editorial maintenance. |
| Planned or conditional | Further source enrichment and additional image-provider research. These should not be presented as delivered features. |
| Validated outcomes | No resident task-completion, usability, adoption, conversion, traffic, or comparative performance outcome was found. The repository documents automated and browser-assisted quality checks, not proof of resident impact. |

### Conflicts and freshness risks

- The README currently says “80 approved images across 42 destinations,” while the inspected media manifest contains **132 records across 58 destinations**. Use the manifest figures only if its 132 records are all intended to be described publicly as approved images; otherwise clarify the status model and update the README later.
- The README reports **133 automated tests**, but the exact current count was not re-run for this brief, and later test files may make that number stale. Say “an automated test suite” unless a fresh result is captured.
- The repository contains **255 normalized property records** and **249 resident-facing destination records**. These are different layers, not competing totals. Portfolio copy should use 249 when describing public destination pages.
- Repository history shows source milestones, not deployment dates. Do not label a commit date as a public release date without deployment evidence.

### Not established

- That the current repository revision is deployed.
- That the live application has production traffic or active resident use.
- That the interface improves task speed, comprehension, or success relative to the official site.
- That the activity taxonomy matches residents’ mental models.
- That the site is fully WCAG conformant or universally accessible.
- That every location, quantity, image, or external link is complete or error-free.
- That the City of San Francisco endorses or maintains the project.
- The complete personal-role and collaborator statement.

---

## 3. Existing-claim audit

| Claim or likely portfolio phrasing | Assessment | Recommended correction |
| --- | --- | --- |
| “A better way to find San Francisco parks” | “Better” implies comparative evidence that is not available. | “An independent, resident-centered way to explore San Francisco parks and recreation destinations.” |
| “I simplified the San Francisco parks system” | Too broad; official transactions and policies remain outside the product. | “I designed a discovery layer that organizes selected public data and routes official transactions back to City services.” Confirm the “I” statement first. |
| “A comprehensive park database” | Overstates completeness and blurs properties, destinations, and sources. | “A resident-facing layer for 249 destinations generated from reviewed City open data and supplemental sources.” |
| “Real-time transit information” | Incorrect. The product imports scheduled GTFS data and derives nearby options at build time. | “Build-time nearby Muni, BART, and Caltrain context from 511 regional GTFS data.” |
| “Accessible by design” | Directionally fair but easily read as a conformance claim. | “Built with semantic structure, visible focus states, 320 CSS-pixel reflow checks, reduced-motion support, and an automated accessibility baseline; manual assistive-technology testing remains.” |
| “Verified park information” | Too absolute. Source review and provenance do not eliminate source errors or omissions. | “Reviewed, source-linked information with explicit handling for uncertainty and known coordinate corrections.” |
| “Residents can complete reservations and registration” | The product provides handoffs; it does not own those flows. | “Residents can identify the appropriate official program or reservation path and continue on the San Francisco Recreation and Parks website.” |
| “AI-free” | The public runtime avoids generative-AI dependency, but the project process and all tooling have not been audited as AI-free. | “The resident-facing search and browsing experience does not require generative-AI calls or per-query token spending.” |
| “Production application” | Deployment and operational status were not verified. | Use “working prototype” or “deployed prototype” only after confirming the public URL and revision. |
| “133 tests pass” | The README count may be stale, and no fresh run was inspected for this brief. | “The repository includes automated coverage for data policy, normalization, search, maps, accessibility baselines, links, and presentation behavior.” Add a dated count only with fresh output. |

---

## 4. Portfolio-ready replacement copy

The copy in this section is ready to adapt for a portfolio page. Bracketed text requires owner confirmation.

### Opening

# Turning public park data into resident-centered discovery

San Francisco has extraordinary public spaces, but the information residents need is distributed across open-data records, facility pages, program systems, maps, and transit feeds. SF Parks Explorer is an independent prototype that brings those sources into a clearer browsing experience—while preserving the City of San Francisco’s role as the authority for policies, registration, permits, and reservations.

The current implementation generates 249 destination pages and supports search by place, activity, amenity, geography, acreage, and amenity count. It also adds map-based browsing, nearby scheduled transit context, source links, image attribution, and direct handoffs to official services.

### Role and context

**Role:** [Confirm title and responsibilities]  
**Timeframe:** Repository history begins in August 2026; confirm the actual project start and any release dates.  
**Collaborators:** [Confirm human collaborators, reviewers, and technical assistance]  
**Status:** Working implementation in a public repository; confirm the current live URL and deployed revision.

I approached the project as a product, content, and data-design problem rather than a visual redesign of the official website. The work included defining a safe product boundary, translating administrative records into public concepts, designing search and browsing behavior, documenting source and image policy, and building maintenance tools for corrections, notices, and media.

### Problem

The underlying information was not absent so much as organized for different institutional purposes. A resident planning a visit might need to combine a property record, an amenity listing, an official facility page, a map, a transit schedule, and a separate registration or reservation system. That fragmentation makes a simple question—“Where can I do this, and what should I know before I go?”—harder to answer.

The design challenge was to create a useful layer over those sources without overstating completeness, disguising uncertainty, or building a competing transaction system.

### Current result

SF Parks Explorer turns reviewed source records into a static, browsable public model. Residents can begin with a conventional search or filter by activity, amenity, area, neighborhood, ZIP code, minimum acreage, and minimum amenity count. Results remain available as text even when the map is closed, and relevant filter state can be preserved in a shared URL.

Each destination page brings together durable place information, imagery, amenities, nearby scheduled transit options, maps, provenance, and official next steps. Area and neighborhood pages provide additional browsing paths. A local-only editor supports time-limited notices, image ordering and attribution, and reviewed coordinate overrides without exposing editing controls on the public site.

This is evidence of implemented scope—not yet evidence that residents complete tasks faster or more successfully. That is the next validation question.

### Decision story 1 — Draw a boundary around discovery

**Portfolio copy**

The strongest early decision was what *not* to build. Program registration, permits, and reservations carry changing rules, inventory, identity, payment, and policy requirements. Reproducing those systems would create a second source of truth and a significant maintenance burden.

I instead treated SF Parks Explorer as a discovery and orientation layer. The product helps a resident identify a relevant place or service, understand the available evidence, and then continue through a labeled handoff to the official San Francisco Recreation and Parks website. This kept the prototype focused on the information architecture problem while respecting institutional authority.

**Evidence:** dedicated Programs and reservations route; structured handoff data; link-validation script and tests; destination-page official links.  
**Status:** Implemented in the repository. Current external-link health should be rechecked before publication.  
**Suggested visual:** A three-frame flow: Explore result → destination or program pathway → labeled official handoff.  
**Claim boundary:** Do not imply that registration or reservation occurs inside the prototype.

### Decision story 2 — Put governance before aggregation

**Portfolio copy**

Combining datasets was not a simple join. Source rows used different identifiers, represented overlapping physical concepts, and sometimes conflicted with the way residents understand a place. I created a layered model that preserves immutable imports, normalizes source records, and then builds a separate presentation layer for public destinations.

The source registry records provenance and permission status. Matching rules fail closed when evidence is ambiguous, quantities are only shown when the source supports them, and duplicate administrative evidence can be consolidated without deleting its lineage. The result is not a claim of perfect data; it is a system that makes editorial judgment visible and revisable.

**Evidence:** source registry and validation, normalized datasets, generated destinations, provenance fields, policy tests, content and coordinate override records.  
**Status:** Implemented. Source freshness still depends on scheduled or manual imports.  
**Suggested visual:** A compact diagram showing Source registry → immutable imports → normalized records → presentation destinations → static pages.  
**Claim boundary:** “Governed” or “source-linked” is supportable; “complete” or “fully accurate” is not.

### Decision story 3 — Translate records into resident choices

**Portfolio copy**

The source data describes properties, facilities, functional areas, and assets. Residents are more likely to begin with a goal: find a playground, compare parks with restrooms, look near a neighborhood, or understand which destinations are large enough for a particular outing.

I translated those records into conventional search, twelve activity entry points, amenity and geographic filters, minimum acreage and amenity thresholds, transparent result explanations, and a map that remains optional. The filter state is encoded in the URL, so a useful result can be shared without recreating the search. The interface also preserves a complete text-result path for people who do not or cannot use the map.

**Evidence:** Explore route, search index, filter specification, nine area records, 41 populated neighborhood records, destination ranking and URL-state modules, MapLibre implementation.  
**Status:** Implemented. The taxonomy has not yet been tested with residents.  
**Suggested visual:** Desktop and narrow-screen Explore views using the same search, active filters, result explanation, and map state.  
**Claim boundary:** Describe the taxonomy as designed and implemented, not validated as residents’ preferred mental model.

### Decision story 4 — Treat corrections as evidence, not silent exceptions

**Portfolio copy**

Mapping exposed a particularly important source limitation: an official coordinate can be syntactically valid and still put a park in the wrong place. A global invalid-coordinate filter solved obvious failures, but not plausible-looking points in water or on the wrong side of an island.

I added an auditable override workflow instead of silently changing generated records. A correction records the destination, replacement coordinate, supporting map URL, reason, reviewer, and date. The reviewed coordinate is then reused across MapLibre markers, Google Maps embeds and directions, and transit proximity calculations so the product does not disagree with itself.

**Evidence:** coordinate audit report, explicit correction registry, admin map-override form, shared coordinate resolution, regression tests; documented Signal Point Park and India Basin Shoreline Park corrections.  
**Status:** Implemented for reviewed exceptions. A full ground-truth audit of every destination has not been established.  
**Suggested visual:** Before-and-after map detail plus the corresponding correction record, with personal tokens removed from URLs.  
**Claim boundary:** Do not suggest that Google Maps is inherently authoritative; present it as reviewed supporting evidence.

### Decision story 5 — Build a maintainable editorial layer

**Portfolio copy**

Evergreen facts and temporary conditions have different maintenance needs. The generated destination model remains source-driven, while a local-only editor handles the content that requires human stewardship: expiring park notices, image visibility and order, attribution, uploads to Vercel Blob, and reviewed map corrections.

The image policy also separates real destination photography from a clearly identified generic illustration. Open-license images retain source and license metadata, while original photography can be credited directly. This reduces repository weight and makes the public presentation easier to maintain without turning the prototype into a public CMS.

**Evidence:** local admin route and API restrictions, SQLite-backed editorial records, Vercel Blob manifest, media attribution fields, expiring notices, 132 current media records across 58 destinations.  
**Status:** Implemented locally. The editor is intentionally unavailable on the live site.  
**Suggested visual:** Admin notice and image controls beside the resulting public notice or gallery. Label the editor “local-only.”  
**Claim boundary:** Do not present the editor as a multi-user production CMS.

---

## 5. Compact development and delivery timeline

Dates below are source-control milestones, not verified public release dates.

| Period | Evidence-backed milestone |
| --- | --- |
| August 2026 | Defined the resident-centered opportunity, data-governance rules, normalization model, initial Explore experience, and static destination pages. Repository history begins August 28. |
| Late August 2026 | Added official-content review, enrichment rules, MapLibre browsing, accessibility baselines, acreage and geographic filters, and repository documentation. |
| September 1, 2026 | Added Vercel Blob media delivery and expanded the original-photography workflow. |
| September 18–20, 2026 | Added the local editorial tool, coordinate overrides, notices, image management, area and neighborhood pathways, navigation and typography refinements, and Explore performance work. |
| October 13, 2026 | Expanded the image library and restored a generic illustration for destinations without real photography while retaining the Fort Mason photograph in the homepage hero. |
| Current | 249 public destination records, nine areas, 41 populated neighborhoods, 132 media-manifest records, and scheduled-transit context from 85 routes and 3,314 stops or stations. Manual accessibility and resident usability validation remain open. |

---

## 6. Visual evidence plan

| Visual | What it should prove | Suggested caption |
| --- | --- | --- |
| Explore, wide view | Search, filters, text results, optional map, and compact controls coexist. | “Explore combines conventional search, resident-facing filters, shareable state, and an optional map without making map interaction the only browsing path.” |
| Explore, 320–400 px view | The same core task adapts to the supported narrow layout. | “The filter system becomes a keyboard-contained dialog on narrow screens while the result list remains the primary accessible surface.” |
| Destination page | Durable place details, breadcrumbs, imagery, amenities, transit, and official sources form one coherent page. | “A generated destination page combines permanent place information with source links and official next steps.” |
| Area → neighborhood → park sequence | The project supports geographic browsing beyond a flat list. | “Area and neighborhood landing pages create a legible path from a broad part of San Francisco to individual destinations.” |
| Data-flow diagram | Administrative sources remain distinct from public presentation decisions. | “Immutable imports are normalized before a reviewed presentation layer generates public destinations.” |
| Coordinate correction | The project treats known source errors as auditable evidence. | “Reviewed overrides correct known map errors consistently across maps, directions, and transit calculations.” |
| Local editor | Ongoing maintenance has a designed workflow. | “A local-only editor manages expiring notices, media, attribution, order, visibility, and reviewed coordinate corrections.” |
| Image attribution or gallery | Photography is useful and rights-aware rather than decorative. | “Original and open-license photographs retain creator, source, and license metadata; a generic illustration is used when no destination photograph is available.” |

Prefer screenshots with realistic but non-sensitive state. Add a short evidence label—**Implemented**, **Prototype**, or **Planned**—to every figure. Do not use a polished mockup to imply a flow is live.

---

## 7. Most useful next validation steps

1. **Verify the public artifact.** Record the live URL, deployed commit, deployment date, and whether local-only features are correctly excluded.
2. **Run five task-based resident sessions.** Include finding a place for a specific activity, comparing two destinations, locating a park by geography, planning transit, and reaching an official reservation or program page. Capture completion, wrong turns, uncertainty, and participant language—not just preference.
3. **Test the taxonomy.** Ask participants where they expect ambiguous concepts such as courts, community gardens, natural areas, and recreation centers to appear. Use the findings to validate or revise categories and synonyms.
4. **Complete manual accessibility checks.** Test representative flows with keyboard only, NVDA and VoiceOver, 200% zoom and text resize, orientation changes, and physical touch targets. Preserve issue-level evidence rather than publishing a blanket compliance claim.
5. **Establish freshness evidence.** Record the last successful City-data import, transit import, official-link audit, and content review. Show dates in the case study only when the refresh process is repeatable.
6. **Measure a narrow outcome after release.** Good first measures are successful official handoff, destination-page reach from Explore, zero-result rate, and whether participants can explain why a result matched. Avoid vanity totals without a task context.
7. **Reconcile documentation counts.** Decide whether all 132 manifest records qualify as approved images, refresh README totals, and capture a fresh automated-test and production-build result.

---

## 8. Claim record

| Claim | Current status | Evidence | Revisit when |
| --- | --- | --- | --- |
| The product generates 249 resident-facing destinations. | Supported | `data/presentation/generated/destinations.json` reports 249 records. | After any normalization or presentation rebuild. |
| The project supports nine areas and 41 populated neighborhoods. | Supported in content records | `data/content/place-pages.json` contains nine area and 41 neighborhood records. | After boundary or visibility changes. |
| Nearby transit uses 511 regional GTFS data. | Supported | Normalized transit data contains 3 agencies, 85 routes, and 3,314 stops or stations; importer and documentation identify 511. | After each transit refresh. |
| Images are rights-aware and attributable. | Supported as a process | Media manifest includes creator, source, and license fields; imagery policy documents review requirements. | Audit a sample of rendered credits before publication. |
| The public runtime does not depend on generative AI. | Supported by architecture inspected | Search, filtering, ranking, static content, and generation are deterministic and build-time. | If runtime services change. |
| The product is accessible. | Partially supported; phrase narrowly | Automated/browser-assisted baseline and documented fixes exist; manual assistive-technology work remains. | After the outstanding manual audit. |
| Residents find information faster or more successfully. | Unverified | No task-study or comparative outcome evidence inspected. | After moderated or unmoderated task testing. |
| The activity taxonomy matches resident expectations. | Unverified | Taxonomy rationale exists; user validation does not. | After card sorting or task-based research. |
| The current code is live. | Unverified | Deployment was reported, but URL and revision were not inspected. | When the live URL and commit are recorded. |
| Michael Baker independently completed all design and implementation. | Unverified | Repository ownership and project notes support leadership, not the absence of collaborators or assistance. | After the role and collaborator statement is confirmed. |

---

## 9. Page structure and editorial priorities

### Recommended portfolio-page order

1. Central claim and one representative product image.
2. Concise role, timeframe, collaborators, and status.
3. The fragmented-information problem and the product boundary.
4. Current result with a small set of precise scope figures.
5. Three primary decision stories: discovery boundary, governed data model, and resident-facing browsing.
6. Two supporting decisions: coordinate corrections and editorial maintenance.
7. Current limitations and next validation.
8. Repository and live-product links.

### Keep out of the main narrative

- A chronological list of every style adjustment or breakpoint change.
- Tool names without an accompanying product or governance decision.
- Large tables of amenities, datasets, tests, or routes.
- Claims that the prototype fixes the official website.
- The internal admin implementation unless it is used to explain sustainable maintenance.
- Unverified deployment, accessibility, or resident-impact language.

### Corrections to make before publication

- Replace stale image totals in the README or explain the manifest status model.
- Capture a fresh test/build record rather than repeating the README’s test count.
- Supply and inspect the live URL; record the deployed commit.
- Confirm the role, collaborators, project start, and release dates.
- Decide whether “Baker Parks” is a portfolio label only or a public-facing project name; the repository and interface currently use **SF Parks Explorer**.

### Owner questions that materially affect accuracy

1. What role title and responsibility statement should appear, and did any human collaborators, reviewers, or technical assistants contribute?
2. What is the current live URL, and which repository commit is deployed there?
3. Is there an existing portfolio whose audience and voice this page should match?

---

## 10. Sources inspected

### Repository evidence

- [Repository root and project history](https://github.com/michael-baker-content/sf-parks)
- [`README.md`](https://github.com/michael-baker-content/sf-parks/blob/main/README.md)
- [`docs/case-study-notes.md`](https://github.com/michael-baker-content/sf-parks/blob/main/docs/case-study-notes.md)
- [`docs/accessibility-audit.md`](https://github.com/michael-baker-content/sf-parks/blob/main/docs/accessibility-audit.md)
- [`docs/product-roadmap.md`](https://github.com/michael-baker-content/sf-parks/blob/main/docs/product-roadmap.md)
- [`docs/data-governance.md`](https://github.com/michael-baker-content/sf-parks/blob/main/docs/data-governance.md)
- [`docs/search-and-filter-specification.md`](https://github.com/michael-baker-content/sf-parks/blob/main/docs/search-and-filter-specification.md)
- [`data/presentation/generated/destinations.json`](https://github.com/michael-baker-content/sf-parks/blob/main/data/presentation/generated/destinations.json)
- [`data/content/place-pages.json`](https://github.com/michael-baker-content/sf-parks/blob/main/data/content/place-pages.json)
- [`data/media/media-manifest.json`](https://github.com/michael-baker-content/sf-parks/blob/main/data/media/media-manifest.json)
- [`data/normalized/transit.json`](https://github.com/michael-baker-content/sf-parks/blob/main/data/normalized/transit.json)
- Local Git history through October 13, 2026.

### Contextual sources identified in project documentation

- [Emma Silvers, “San Francisco’s Parks Are Incredible. Why Is the Rec and Park Website So Bad?”, Coyote Media, August 24, 2026](https://www.coyotemedia.org/san-francisco-rec-park-website-bad/). The project notes summarize this as a catalyst; the article itself was not independently re-audited for this brief.
- [DataSF Terms of Use](https://www.sf.gov/reports--april-2017--datasf-terms-use), referenced by the project’s source-governance records.
- [511 Open Data](https://511.org/open-data), identified by the transit import and documentation.

### Materials not available for inspection

- An existing portfolio page or portfolio voice reference.
- A live-product URL and deployment revision.
- Research recordings, participant notes, analytics, or outcome metrics.
- A confirmed role and collaborator statement.
- Fresh test and production-build output tied to the current repository revision.

These gaps do not prevent a credible implementation case study, but they limit claims about personal ownership, public availability, accessibility conformance, and resident outcomes.
