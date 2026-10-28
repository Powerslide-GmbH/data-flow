# Powerslide Data Flow

An interactive documentation map of Powerslide automations and synchronizations. The first inventory covers development and master lists, the admin pricing hub, Weclapp, Sales Layer and Shopify. The model supports additional systems and business processes without changing the UI.

## Run locally

Requires Node.js 22.19 or later and npm.

```sh
npm ci
npm run dev
```

Open the printed local URL under `/data-flow/`. `npm test` checks field tracing, and `npm run build` validates the data model, checks TypeScript and builds `dist/`.

## Maintain the map

Edit `data/map.json`, the canonical application dataset. `data/saleslayer-schema.json` records the field metadata snapshot used for the first inventory (not product records).

- `systems`: stable ID, title, role, description, color and initial x/y coordinates.
- `groups`: reusable families of fields. The UI renders each populated family as a independent capsule around its system.
- `fields`: stable ID, system and group IDs, technical key, visible label, entity level, evidence and optional type/context/multilingual flag.
- `flows`: directional system-to-system route, field families, execution mode, schedule, platform, evidence, activation status, source reference, rules and mappings.
- `mappings`: source and destination field-ID arrays plus an explicit transformation rule. Several sources or targets are supported. Never invent these from similar names. Leave mappings empty for family-level routes.

IDs must be unique and endpoints must exist. Run the build before committing. Duplicate sheet headers retain their cell coordinates. Field tracing follows upstream and downstream separately and is cycle-safe. A sibling destination is not an ancestor. Highlighted sources are the starting points of documented mappings, not a claim that no other upstream source exists. It is documentation, not an execution simulation.

To add a new automation, add its systems/fields if needed and one directional flow. Add two flows if different actions run in opposite directions. Include review evidence and distinguish implemented code from observed deployment.

## Evidence and limitations

Initial review: 28 October 2026. Sources are the local nightly Weclapp sync, pricing and release-calendar Apps Scripts, currency correction function, live Master/Develop headers, Sales Layer field metadata, and product/variant metafield references in the B2B and B2C Liquid themes. Sales Layer channel names were reviewed in the signed-in channel list.

`Verified schema` means the field exists in the returned schema; `Theme usage` means it is referenced by a theme, not that it is populated or written by Sales Layer. `Verified in code` is not proof of live activation. `Reported` and `Approximate` routes document the owner's architecture or family-level connectors; their exact bindings/schedules remain unverified. The primary order importer is separate from the currency updater. Historical/disabled connector instances are not treated as active syncs. No live monitoring is performed.

All counts are inventoried fields and documented routes, not counts of synchronized fields. Unknown routes have no fabricated field links. Source references identify implementation files without copying their code or secrets. No credentials, customer/order records, product rows or price values belong in this public repository.

## Publish

GitHub Pages uses GitHub Actions. Set Settings → Pages → Source to GitHub Actions. A push to `main` runs tests and builds the static site. The workflow publishes `dist/`. The Vite base path is `/data-flow/`.

Drag system or family capsules freely; nearby capsules move apart. The + button opens family satellites. Select any field in search or the library to see its upstream/downstream journey; documented starting points have a crown and stronger glow. Unknown origins remain explicitly unknown.

Layout changes are saved only in the current browser. Arrange resets the map. Float toggles gentle movement, Flow pauses animated transfer particles, and Labels reveals route names. Family membership lines have no transfer animation. Reduced-motion preferences initially disable motion and particles. Animation describes direction, not current traffic.
