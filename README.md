# Powerslide Data Flow

An interactive documentation map of Powerslide automations and synchronizations. The first inventory covers development and master lists (including Admin scripts), Weclapp, Sales Layer and Shopify. The model supports additional systems and business processes without changing the UI.

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
- `groups`: reusable families of fields. The UI renders each populated family as a child capsule inside its expanded system.
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

Drag system or family capsules freely; nearby capsules move apart. The + button expands a parent capsule containing its families. Drag the parent to move the whole group. Select any field in search or the library to see its upstream/downstream journey; documented starting points have a crown and stronger glow. Unknown origins remain explicitly unknown.

Layout changes are saved only in the current browser. Arrange recalculates the map from documented creation stages and route neighbours. Return routes do not change stage direction. Unstaged leaf systems are placed in the last column for display only; this does not assert a product-creation route. Column widths and spacing adapt to expanded systems. Float is off by default and toggles gentle movement, Flow pauses animated transfer particles, and Labels reveals route names. Family membership lines have no transfer animation. Reduced-motion preferences initially disable transfer particles as well. Animation describes direction, not current traffic.

## Planning and ownership

Product creation is documented separately as Develop → Master / Weclapp (approximately the same stage) → Sales Layer → B2B / B2C. This reported business sequence does not create verified field mappings.

Master price list owns all pricing information, as confirmed by the owner. Admin is its automation layer, not a separate system. Projection aliases remain distinct from sheet columns because the exact formula bindings are not verified. The two-way Develop/Master workflow is intentional: unfinished products can return to Develop for further work. The existing manual Quote mapping is retained as implementation evidence; Master remains the pricing owner.

Opportunities compares normalized field labels and a small explicit alias list. It excludes documented automatic pairs, highlights manual transfers and flags existing family-level connectors for mapping review. Different levels, duplicate columns and competing writers are shown as checks. Metadata similarity does not establish duplicate manual entry or equal values. Price proposals always originate in Master; the product creation sequence suggests other directions without asserting ownership.

Use New idea to propose a source/destination pair, Shortlist or Dismissed to review, and Notes for decisions. Drafts persist only in the current browser under data-flow-opportunities-v1. Export ideas downloads a JSON backup including resolved proposals and decisions; it does not update the repository or activate any integration.


## Admin Price List · ID linking (4 November 2026)

The Admin Price List menu separates sending prices/data from linking Shopify IDs. ID actions have two modes: visible selected references from Prices & Details filtred, or Shopify products created since C24. Both offer All stores, B2B (Powerslide only) and B2C (Powerslide, Disroyal, Venerate). C23 was removed. The general button links selected products across all four stores before sending existing price flows; date mode is independent.

Product/variant GIDs map to the same exact-SKU weclapp article. Native attribute pairs: B2B 10890/10892; Powerslide B2C 22433/22435; Disroyal 4771/4773; Venerate 136860/136862. Unchanged pairs are skipped; partial writes preserve other stores and unrelated data. Details go to Shopify ID Sync Log and combined progress/errors to Production Sync Log. Only non-blocking toast summaries appear; test actions remain available in source but are not in the daily menu.

Queries are batched and paginated. Selected mode avoids downloading unrelated products by creation date. ID and price writes remain separate phases; no claim is made that they are a single API update. Large B2B price sends still prepare a CSV requiring Shopify import. The map documents routes and is not live execution monitoring.

## Languages, quick links and mobile

English is the default. The header selector switches to German or Spanish and remembers the choice in this browser. UI and documented system/flow descriptions are translated through `src/locales.json`; identifiers, technical keys, original field labels, source references and user-entered notes retain their original text. Changing language does not change filter values or saved proposals.

Each system's `links` in `data/map.json` provides its quick links in the details panel. Master includes Master and Admin sheets; each Shopify store has separate storefront and admin URLs. Sheet and platform permissions still apply.

On phones, Map opens a scrollable system overview grouped by creation stage. Interactive map remains available through the view switch. The header menu collapses, filters use a compact two-column panel, and system details open as a bottom sheet. Escape closes open details, search, filters and navigation. Entry transitions respect reduced-motion preferences. Canvas bounds update when the viewport changes or the interactive map becomes visible.
