---
title: The Rules Behind the Photo Grid
summary: Adding a visual way to explore parks sounded simple. Accessibility, image rights, performance, and honest missing-data states made it a much more interesting engineering problem.
publishedAt: 2026-10-15
actionLabel: Try the park explorer
actionHref: /explore/?layout=photos
---

A photo grid is one of those features that can sound finished before anyone writes a line of code.

Put the photographs in rectangles. Add the park names. Let people click. Done.

That was roughly the idea when I decided to add a Photo view to SF Parks Explorer. The existing Explore page already had search, filters, sorting, a map, and a text-first list of results. I had also built a growing archive of park photography. Letting someone swap the result list for image tiles seemed like a natural way to connect the two.

It was natural. It was not simple.

The interesting work began when I asked what rules the new view should follow—and, more importantly, who would pay the price if it did not follow them.

## The feature cannot become the only route

The most immediate decision was to keep List as the default view.

That choice benefits people who need more than a promising photograph to decide whether a park fits their plans. A photograph might communicate atmosphere, but the list exposes names, neighborhoods, matching filters, and recorded amenities more directly. It is also the more dependable route for screen-reader users, people browsing without images, and anyone trying to compare several destinations without decoding a wall of thumbnails.

Photo view therefore became an alternate presentation of the same results—not a separate search experience. Search terms, filters, sorting, pagination, and result counts stay intact when the presentation changes. The map remains independent, too. A visitor can use Map plus List or Map plus Photo without one control silently changing the other.

This sounds like a small interface detail. Technically, it meant resisting the temptation to overload one convenient variable. The application already tracked whether the map was open. Photo view needed its own state, its own URL parameter, and its own return path when someone opened a park and came back. Every filter form and sorting action had to preserve both choices.

State multiplies quickly. Two result layouts, two map states, many filter combinations, three sort orders, and progressive result batches create far more possible interfaces than the initial mockup suggests. The benefit is that a keyboard user, a mobile visitor, and someone sharing a filtered URL all receive the same underlying results instead of three subtly different products.

## A missing photograph should look missing

The archive does not have a verified photograph for every park. The easy solution would have been to borrow an attractive image from another destination. It would also have been misleading.

Someone scanning quickly could reasonably assume that the photograph belonged to the park named beneath it. Alternative text would not repair that mistaken visual claim. A generic “San Francisco park” photograph would still depict a real place that was not the result being offered.

So destinations without approved imagery receive a colorful gradient square labeled “No photograph available.” The gradients vary enough to keep the grid lively, but contain no invented landscape, bridge, playground, or trail. The park remains in the results and retains the same route to its full information page.

This benefits people who rely on the interface to be literal. It avoids presenting an aesthetic approximation as evidence. It also keeps destinations with incomplete media coverage from disappearing altogether—a disappearance that would disproportionately hide small neighborhood parks and less-photographed parts of San Francisco.

The technical irritation is that placeholders still have to behave like real content. They need stable dimensions so the page does not jump while loading. Their labels need sufficient contrast across several gradients. They need to remain legible at the narrowest supported viewport. And the system needs a deterministic way to assign them so they do not appear to change randomly on every render.

In other words, even the absence of an image needs a data model and a design system.

## “Featured” is an editorial claim

Once a destination has several images, another deceptively small question appears: which one should represent it elsewhere?

Gallery order is not necessarily the answer. A sequence may make sense on the park page while its first photograph performs poorly as a square Explore tile or a wide homepage card. Reordering the entire gallery to improve one card would make presentation concerns leak into editorial storytelling.

I added a separate featured-image choice to the local editor. An editor can select one visible image per park as the default for Explore tiles, homepage features, and automatic area or neighborhood imagery. If no featured image is selected, the first visible gallery image remains the fallback. The choice does not alter the gallery itself.

That freedom comes with restrictions. A hidden image cannot be featured. A blog-only upload cannot quietly become a park photograph. Two images cannot both be the featured default for the same destination. These conditions are enforced in the saved media data rather than left as instructions someone has to remember.

Those rules benefit visitors by making representative images intentional and consistent. They also benefit future editors by turning an invisible convention into an explicit control. The technical pain point is familiar: a checkbox in the interface requires validation in the editor, validation in the data pipeline, fallback behavior throughout the public site, tests for conflicting states, and shared selection logic so five components do not each invent their own definition of “default.”

## The photograph carries obligations with it

The visual archive combines photographs I took with selected second-party images. A publicly viewable image is not automatically an image I am entitled to republish.

For Creative Commons and public-domain material, the project stores the creator, exact license and version, source page, review date, and destination relationship. The public interface keeps the creator and license links attached to the image. Candidate images fail closed when the identity, source, rights, or destination match is uncertain.

This policy directly benefits photographers and other creators. Attribution does not become optional because it makes a tile less tidy. License terms do not collapse into a vague “from Wikimedia” label. It also benefits visitors, who can inspect where an image came from and distinguish an independently assembled guide from an official photographic record.

The technical cost is density. A clean grid wants short cards. Responsible reuse wants visible credits, durable source links, license metadata, and validation. Responsive layouts have to accommodate long creator names and URLs without overflowing. Image records have to remain connected to Blob delivery variants without losing their provenance. Removing an image from the editor cannot casually break a blog post that still references it.

The awkward metadata is part of the product, not administrative debris.

## Visual does not mean image-dependent

The project’s imagery policy treats photographs as enhancement. Essential information such as amenities, transit guidance, notices, and official next steps cannot exist only in an image or its alternative text.

For people using screen readers, alternative text describes useful visible content rather than repeating the park name. Controls expose whether List or Photo is selected. Dynamic result counts are announced politely. Slideshows use manual previous and next controls instead of autoplay. Keyboard focus has to remain visible against light and dark surfaces.

For people with low vision, the core text palette and shared button states are checked against WCAG AA contrast targets. The layout is designed to reflow at 320 CSS pixels, which also helps people using browser zoom. For people who prefer reduced motion, decorative transitions are disabled. For people on slower connections, images use responsive variants, reserved dimensions, lazy loading, and progressive batches rather than requesting every full-size image at once.

Each measure introduces friction for development. A hover treatment cannot be evaluated only by how polished it looks with a mouse. A modal needs focus behavior, a keyboard exit, a useful accessible name, and a background treatment that does not destroy contrast. A thumbnail needs an appropriate source size. A slideshow that would be effortless with autoplay becomes a small state machine with announcements and controls.

The constraints eliminate shortcuts. That is often their value.

## What the site can honestly claim

This work makes it tempting to place a broad accessibility badge on the project and declare victory. I do not think the evidence supports that claim yet.

What I can say is narrower and more useful. The project has a documented accessibility baseline. Sampled pages have been checked for landmarks, headings, accessible control names, alternative text, keyboard focus, result announcements, and 320-pixel reflow. Automated regression tests cover the core color palette and shared button states against WCAG AA contrast targets. The imagery workflow requires reviewed rights and attribution metadata before publication.

What I cannot yet claim is complete WCAG conformance. Browser automation is not a substitute for hands-on sessions with NVDA and VoiceOver. Representative task flows still need broader keyboard-only testing, 200-percent zoom review, physical-phone checks, and testing with people whose daily browsing depends on these features. Nor can the site claim that a photograph proves current conditions, accessibility, or the presence of an amenity. The interface deliberately keeps those claims separate.

That distinction matters because policy language can become another kind of user interface. “Accessible” and “verified” sound reassuring, but they are promises. If the testing and evidence do not match the promise, the label serves the project more than the people it names.

## The rules made the feature better

The Photo view took more work because it had to coexist with the list, preserve complex URL state, respect missing data, carry attribution, avoid false visual claims, choose representative images consistently, and perform well on small devices and slower connections.

Those are real technical pain points. They are also the reason the result feels like part of the application rather than a decorative gallery attached to it.

The rules forced me to ask who might be excluded, misled, overwhelmed, uncredited, or slowed down by the easiest implementation. They turned a row of attractive rectangles into a feature with boundaries I can explain and behavior I can test.

It turns out a photo grid is not just a photo grid.

That is what made it worth building.
