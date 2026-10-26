# portfolio

Personal portfolio built with [Astro](https://astro.build/): **https://sparklingstadt.github.io/portfolio/**

The main page is written as a "Living Standard": a specification-style document with numbered sections, a table of contents, RFC 2119 requirements, an IDL block, notes, examples, and references. It is a port of [sparklingstadt.github.io](https://github.com/Sparklingstadt/sparklingstadt.github.io) to a static Astro site with no client-side framework.

## Development

```sh
npm ci
npm run dev      # http://localhost:4321/portfolio/
npm run build    # writes dist/
npm test         # checks src/data and src/i18n, and dist/ when it exists
npm run preview  # serves dist/
```

## Structure

| Path | Contents |
| --- | --- |
| `src/data/site.json` | `profile` (name, GitHub account, email), `certifications`, `projects`, and `text` (copy shared by the mocks) |
| `src/i18n/{ja,en,zh}.json` | UI strings of the main page; keep the keys identical across languages |
| `src/pages/[...lang].astro` | The main page, built once per language |
| `src/layouts/SpecLayout.astro`, `src/styles/spec.css` | Head, theme toggle, and styles of spec-style pages |
| `src/pages/proposals/mocks/` | The mock list and the seven design mocks |
| `public/proposals/mocks/<plan>/` | Each mock's own `style.css` and `script.js` |
| `public/proposals/mocks/data.js` | Re-renders shared text when a mock switches language |

## Languages and theme

Each language is its own static page: Japanese at `/`, English at `/en/`, and Simplified Chinese (`zh-Hans`) at `/zh/`, linked with `hreflang` alternates. The "Last Updated" date is formatted per language at build time with `Intl.DateTimeFormat`; change `updated` in `src/pages/[...lang].astro` when the content changes. The theme follows `prefers-color-scheme` until the visitor picks one with the toggle; that choice is stored locally when browser storage is available. The main page works without JavaScript except for the theme toggle.

## Editing content

Change `src/data/site.json` and rebuild. Projects (§5) need an `id`, a `name`, `category` and `description` in `en`/`ja`/`zh`, a `stack`, and `links` (`app`, `source`, optional `sourcePrivate`). Certifications (§8) need an `id` and a `name` in `en`/`ja`/`zh`. `npm test` fails if an entry is missing a language or an https link, if ids repeat, or if translation keys differ.

## Design proposals

`/proposals/mocks/` lists seven design mocks (all `noindex`):

- `plan-b`: Apple HIG style
- `plan-c`: multilingual (Intl.PluralRules and Intl.DateTimeFormat demos)
- `plan-b-a-c`: HIG layout, spec-style type card, and multilingual hero
- `plan-hig-material3`: one markup switched between HIG and Material 3 with design tokens
- `plan-desktop-macos-arch`: desktop of windows switched between macOS and Arch Linux + Hyprland
- `plan-desktop`: macOS, Arch Linux + Hyprland, Material 3, and HarmonyOS
- `plan-swiss`: Swiss (International Typographic Style) grid with the four projects

Astro writes the profile, certifications, and shared copy from `site.json` into each mock at build time. Each mock also inlines that data as `<script type="application/json" id="mock-data">`, so `data.js` can fill elements marked `data-profile`, `data-profile-link`, `data-content`, `data-content-lang`, or `data-certification` again after a language switcher changes their `lang`.

## Deployment

`.github/workflows/deploy.yml` builds and tests every push and pull request, and deploys `main` to GitHub Pages. In the repository settings, set **Pages → Source** to **GitHub Actions**. No analytics or tracking scripts are included.
