---
title: Building SF Parks Explorer, one decision at a time
summary: A look back at how a question about finding San Francisco parks grew into a resident-centered guide built around trustworthy data, clearer choices, and careful editorial work.
publishedAt: 2026-10-13
actionLabel: Explore the park guide
actionHref: /explore/
---

## Starting with a familiar frustration

SF Parks Explorer began with a simple question: why can it be so difficult to find the right park, recreation center, activity, or reservation path when San Francisco has so many excellent public spaces?

The project was inspired in part by reporting about the friction residents encounter on the existing Recreation and Parks website. Useful information can be spread across facility pages, registration systems, PDFs, maps, and other services. Someone planning an ordinary outing may need to understand how those systems are organized before they can answer a much more natural question: *Where can I go to do what I have in mind?*

I did not set out to replace the City of San Francisco's official services. Reservations, program registration, payments, permits, and current operating information still belong with the agencies responsible for them. My goal was to create a clearer discovery layer: help people understand their choices, then provide a direct handoff when an official action is needed.

## Building trust before building features

One of the earliest milestones was less visible than a new page or map. I created a process for reviewing every data source before using it. The project began with Recreation and Parks datasets published through DataSF, including properties, facilities, functional areas, and physical assets.

Those records are valuable, but they were created for several administrative purposes—not as a ready-made visitor guide. Names repeat, relationships are not always explicit, and a technically valid record may still be confusing to someone planning a visit. I kept the imported information intact and built separate layers for normalization and public presentation. That makes it possible to improve the experience without erasing where a fact came from.

This principle has guided the project ever since: when the evidence is incomplete, the site should say so. When a coordinate is wrong, the correction should be documented. When a source has no useful description, an empty space is better than invented certainty.

## Turning records into useful choices

The first major product milestone was the Explore experience. Instead of asking visitors to understand the structure of the source data, it lets them search and filter using familiar goals and features. People can browse by activity, amenity, neighborhood, broader area, park size, or minimum amenity count. They can also sort by relevance, name, or the number of amenities currently represented in the project.

The results map became another important part of that work, but it was designed as a complement to the list rather than a requirement. Marker sizes help distinguish larger destinations, the default view stays focused on San Francisco, and relevant searches can still expand to outlying properties such as Sharp Park or Camp Mather.

Map work also exposed a useful lesson about public data. A coordinate can be present without being correct. Reviews of Signal Point, India Basin Shoreline Park, and other destinations led to a documented override process and automated checks that keep the site's map, Google Maps links, driving directions, nearby parks, and transit information aligned to the same reviewed point.

## Adding context without creating another maintenance problem

Structured data can show that a park contains a court, trail, lawn, or playground. It usually cannot explain the landscape, history, or character of the place. I began a selective enrichment process using reviewed official pages and carefully chosen wiki sources.

The aim was not to make every page as long as possible. Well-known destinations such as Golden Gate Park already have an enormous amount of material available, while many neighborhood spaces have very little. I adopted a content budget that favors short, useful context: a concise overview, selected history, a few representative highlights, and durable physical facts. Temporary schedules, fees, closures, and program details stay out of this evergreen layer.

The project now also includes landing pages for the areas and neighborhoods used in Explore. These pages offer another way to move through the collection: from a broad part of San Francisco, to a neighborhood, to its parks. Empty neighborhood pages are withheld rather than presented as dead ends, and park pages use breadcrumbs to make those relationships visible.

## Making the pages feel like places

Photography has been one of the most rewarding—and time-consuming—parts of the project. Early pages relied heavily on a generic illustration or a small number of reusable images. I reviewed Creative Commons and community-contributed photographs, recorded their licensing and attribution, and rejected images that were attractive but did not really help someone understand the destination.

I have since begun building an original collection. Recent photographs show entrances, slopes, courts, paths, play equipment, waterfronts, gardens, and neighborhood surroundings. The site now delivers responsive versions from Vercel Blob rather than storing hundreds of large image files in the repository. Each image still carries a caption, descriptive alternative text, attribution, license information, and a review record.

This work also produced a local editorial tool. It gives me one place to review existing images, adjust their order, hide or remove them from the catalog, upload new photographs, and maintain temporary park notices. The editor remains local; the deployed public website has no content-editing endpoint.

## Connecting discovery to a real trip

A park guide becomes more useful when it helps someone get there. Destination pages now include nearby scheduled transit information prepared from the regional 511 feed. Visitors can choose Muni, BART, or Caltrain and see relevant nearby stops or possible Muni connections from a regional station.

These are planning clues, not live directions. The site sends visitors to the appropriate transit agency for real-time arrivals, disruptions, transfers, and current accessibility information. That boundary is deliberate: the project should clarify the next step without pretending to be authoritative about conditions that can change minute by minute.

The same idea shaped the programs and reservations guide. Rather than duplicate changing schedules or availability, it helps people identify the type of experience they want and reach the appropriate official pathway.

## What I have learned so far

The hardest part of this project has not been drawing cards or putting markers on a map. It has been deciding what the site can responsibly claim.

Public information rarely arrives in a form that perfectly matches a resident's question. Improving it requires translation, but translation can easily become invention if the source, uncertainty, and exceptions disappear. The project has become an exercise in balancing usefulness with restraint: familiar language without hiding provenance, richer pages without unnecessary length, and corrections without silently rewriting the record.

Accessibility has been part of that same discipline. The interface supports narrow mobile screens, keyboard navigation, visible focus, reduced motion, descriptive image text, semantic page structure, and non-map ways to browse. Automated checks protect many of those decisions, although hands-on testing with assistive technology and physical devices remains an important next step.

SF Parks Explorer is still a prototype, and it does not solve every problem in the larger public-service journey. It does, however, show how official data, careful content design, and small iterative decisions can create a more understandable starting point. The next milestones will continue in that spirit: improve the depth and accuracy of individual pages, expand original photography, and learn where the guide genuinely helps people make a decision.
