# Reviewed coordinate overrides

Use `data/normalization/overrides.json` only when the imported City of San
Francisco coordinate is missing, misleading, or unsuitable as a public map
marker and the automatic geometry review cannot resolve the problem.

Do not edit normalized, presentation, or search output files directly. Those
files are regenerated and will overwrite manual changes.

The local editor provides the preferred interface for these entries: choose a
park, open **Map position override**, and paste a full Google Maps place link.
It records the proper source entity and extracts the place pin coordinates,
which may differ from the viewport coordinates shown after `@` in the URL.

## Entry format

Add one object to the `overrides` array:

```json
{
  "id": "property-48-display-point",
  "entityType": "property",
  "entityId": "48",
  "displayPoint": {
    "latitude": 37.7341538,
    "longitude": -122.3759418
  },
  "evidenceUrl": "https://www.google.com/maps/place/example",
  "reason": "Explain why the imported point is unsuitable and why this replacement is preferable.",
  "reviewedAt": "2026-09-24",
  "reviewedBy": "project-owner"
}
```

Supported entity types are `property`, `facility`, and `functional-area`. Use
the stable source entity ID, not the destination slug. Only one coordinate
override is allowed for each entity.

The evidence URL must be a complete HTTPS address. Latitude and longitude must
be valid and cannot be `0,0`. Missing entities, duplicate overrides, malformed
coordinates, and incomplete review information stop normalization rather than
silently publishing an uncertain point.

## Apply and verify

Run:

```sh
npm run normalize
npm run build:destinations
npm run build:search
npm test
```

The normalized entity receives `precision: "reviewed-manual-point"`. Its
`coordinateReview` record and `data/normalized/normalization-report.json` retain
the original point, replacement point, evidence URL, reason, reviewer, and
review date. All public map and proximity features then inherit the same
normalized coordinate.
