# MOW NSW Members Portal — Reference Build

Static HTML/CSS/JS reference build for a Kentico (Xperience by Kentico) implementation
of the Meals on Wheels NSW Members Portal. No build step, no framework, no dependencies.

## Run it

No install needed. From this folder, run either:

```bash
python3 -m http.server 8000
```

or, if you have Node:

```bash
npx serve .
```

Then open `http://localhost:8000` (or whatever port is printed) in a browser.
Opening `index.html` directly by double-clicking also works, but the nav links
and relative paths are more reliable served over http://.

**Cache-busting**: `styles.css` and `portal.js` are linked with a `?v=N` query
string on every page. Bump `N` across all pages whenever you edit either file —
browsers cache them aggressively even without an explicit Cache-Control header,
and a stale cached copy can make edited pages look broken even though the source
file on disk is correct. If a change doesn't seem to be showing up, this is the
first thing to check.

## Shared chrome is injected, not copy-pasted

The topbar (with the relocated search box), the navy **gradient hero band + wave
divider**, and the base info-popup modal are all injected by `portal.js` from
per-page `<body>` data attributes — they are no longer hand-written into each
file. Every content page sets:

```html
<body data-active="learning.html"   <!-- which nav item is current -->
      data-title="Learning"          <!-- hero H1 -->
      data-crumb="Learning"          <!-- breadcrumb label (empty string = none) -->
      data-sub="…"                   <!-- hero sub-line -->
      data-search="Search …">        <!-- topbar search placeholder (omit to hide) -->
```

`login.html` deliberately sets no `data-active`, so it gets no chrome. The wave
and gradient recreate nswmealsonwheels.org.au's look with inline SVG / CSS
gradients rather than hotlinking the site's PNGs. To change the header for the
whole site, edit `portal.js` once.

## Project structure

```
index.html       Dashboard / Member Hub — onboarding popup, alert + cards that
                  deep-link into the relevant page popup (?open=…)
resources.html    Resources — Operate / Comply / Deliver / Promote. Every card
                  opens a detail popup with an author/owner contact chip (links
                  to Support). Brand pack popup splits Print vs Digital logos.
learning.html     Learning — compact featured "next session" banner, horizontal
                  carousels (upcoming + recordings with filter/search), and a
                  three-up lower row (modules / reading / suggest-a-topic)
news.html         News — Google-News-style two columns (MOW news + Local news),
                  favicon/title/date/author/blurb, click opens a right slide-in
                  drawer with share buttons + source link, plus an announcement composer
connect.html      Connect — Have Your Say consultations (two-pane popup, deep-linkable),
                  a directory teaser → directory.html, communities of practice,
                  and a functional discussion thread (post/edit/delete own +
                  direct message, localStorage-backed)
directory.html    Member directory & map (under Connect) — location + distance +
                  service-type filters over a Leaflet/OpenStreetMap map, website
                  links, contact-via-portal. Sample data, not a real register.
support.html      Support — NSO as standout primary contact, staff contacts by
                  enquiry category (message via portal), Ask for Help, FAQs
myservice.html    Service — editable profile fields, membership benefits
                  (including paid extras), full renewal form popup
login.html        Member login — placeholder, login model still undecided
styles.css        Shared stylesheet, all pages link this one file
portal.js         Injects shared chrome (see above); profile dropdown; generic
                  data-popup + <template> popup pattern; ?open= deep-link handler
```

`brand.html` no longer exists — its content was folded into `resources.html`'s
Promote category, and every page's nav was updated to drop that link.

## Third-party dependency

`directory.html` loads **Leaflet 1.9.4** from unpkg and OpenStreetMap tiles — the
only external dependency in the build, and the only page that needs internet to
render fully. It degrades gracefully to a message + working list if the library
or tiles don't load. Everything else is fully self-contained.

## Design system

CSS custom properties at the top of `styles.css` (`--navy`, `--teal`, `--orange`,
etc.) were checked against the live site (nswmealsonwheels.org.au/meals/find-a-meal)
on 20 Jul 2026, via browser devtools computed styles and CSS custom properties —
see the COLOUR NOTE comment in `styles.css` for the full breakdown. The live
tokens differ from the documented MOW NSW Brand & Comms Guidelines v2 palette in
a few places (navy, teal and orange are all slightly different shades); that's a
real discrepancy worth flagging to MOW NSW brand/comms, not a guess on our part.

Font is Arial throughout. The live site actually loads a licensed webfont ("Neue
Haas Unica") via Adobe Typekit, scoped to MOW NSW's own domain — that kit isn't
embedded here, since pulling a third party's per-domain Typekit ID into an
unrelated reference build isn't appropriate. Arial is also the web-safe font
named in the Brand Guidelines (section 5.1).

Nav labels and page headings are one word each (Home, Resources, Learning, News,
Support, Connect, Service) — simplified from the original longer section names.

## Layout conventions to preserve

- `.mcard` + `.masonry` — dashboard card layout, built with CSS `column-count` and
  `break-inside: avoid`, not CSS Grid's native masonry (still Firefox-only, not
  safe for production).
- `.res-card` / `.res-grid` — resource library item cards, now all popup triggers.
- `.faq-list` — uses native `<details>/<summary>`, intentionally no JS.
- `.modal-overlay` / `.modal` — the base modal shell, reused by every popup
  pattern on the site (onboarding, generic info-popup, two-pane consultation,
  renewal form).
- `.user-menu` — profile dropdown under the topbar's service name/avatar, present
  on every page via `portal.js`. Links to Service page sections; "Log out" points
  at `login.html` since the login model itself is still undecided.
- **Generic info-popup pattern** (`portal.js`, shared `#infoModal`/`#infoModalBody`
  markup on every page): any element with `data-popup` and a nested
  `<template class="popup-content">` opens that template's content in a shared
  modal on click/Enter/Space. Used throughout Resources, and for the "request
  change" links and paid-extra info on the Service page.
- **Two-pane consultation popup** (`connect.html` only, page-specific inline
  script + `#consultModal`): elements with `data-consult` carry two nested
  templates, `.consult-paper` (left pane, scrollable) and `.consult-fields`
  (right pane, a response form). Used for Have Your Say items and communities
  of practice. Not wired into `portal.js` since it's Connect-specific.
- **Horizontal carousels** (`learning.html`): `.carousel` + `.carousel-card`,
  plain CSS scroll-snap, no JS library. Category filter + search on past
  recordings is a small page-specific script, matched against `data-category`/
  `data-title` attributes on each `.rec-card`.
- **Inline profile editing** (`myservice.html`): fields marked `data-field` have
  a paired `.v-view` / `.v-edit` pair toggled by a page-specific script. Approval-
  required fields instead get a `data-popup` "request change" link — they're
  never directly editable.

## Known open items

Search each file for `DEV NOTE` comments, they mark every place a real product
decision is still pending. The big ones:

- **Login model** (organisation-level vs individual accounts) — undecided,
  affects permissions, `login.html`, and the audit trail approach.
- **Moderation policy** for the Connect directory/discussion — not yet signed
  off. Platform needs to support flagging and removal either way.
- **Approval-required fields** on the Service page — draft list only, needs
  confirmation with MOW NSW before build.
- **Brand asset hosting** — in-platform Kentico media library vs external DAM
  with a linked preview, not yet decided.
- **Local media feed** on News, and **grant opportunities** in the grant
  acquittal popup — both are static placeholder content in this demo. Production
  needs a real integration (media-monitoring feed/API; an actual grants data
  source), not fabricated "live" data.
- **Paid membership extras** pricing ($180/$120 shown on the Service page) is
  placeholder, not confirmed MOW NSW pricing — confirm before this goes near
  a real member.

## Not built yet / explicitly out of scope right now

- NSW member map (deliberately excluded per latest direction, may return later
  — the Connect directory uses search/filter over a list instead, styled after
  nswmealsonwheels.org.au/meals/find-a-meal's interaction pattern, not a map)
- Any real Kentico integration or CMS-backed content
- Working form submission, working search (beyond the client-side filters noted
  above), real authentication
- Resource content beyond the samples needed to demonstrate the pattern

## Source documents this build follows

- "Members Section Sitemap – June 2026" workbook (navigation structure, resource
  categories, click-path rules)
- MOW NSW Members Portal Scope of Work (technical requirements, content model,
  security and permissions)
- MOW NSW Brand & Comms Guidelines v2 (colour palette, typography, tone of voice)

## Suggested next steps in Claude Code

1. Confirm real integrations for the two placeholder feeds: local media/alerts
   on News, and grant opportunities in the grant acquittal popup.
2. Once the login model is confirmed, update `login.html` and reflect the choice
   consistently across all pages (e.g. org name vs individual name in the top bar).
3. Extract repeated blocks (topbar, modals, card components) into includes or a
   lightweight templating approach — the topbar/dropdown/info-modal markup is now
   duplicated across 8 files, which is the main drift risk as the design evolves.
4. Wire the inline profile editing and renewal form on the Service page to a real
   save/submit endpoint once the approval-routing workflow is confirmed.
