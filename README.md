# Crispin Lab Website

Academic research group website for the Computational Oncology Group at the University of Cambridge.

Built with [Hugo](https://gohugo.io/) — free, fast, no database needed.  
Deployed automatically to **GitHub Pages** (free hosting) on every push to `main`.

---

## Quick start (local development)

**1. Install Hugo**

```bash
# macOS
brew install hugo

# Windows (Winget)
winget install Hugo.Hugo.Extended

# Linux
sudo snap install hugo
```

**2. Clone and run**

```bash
git clone https://github.com/YOUR-ORG/crispinlab.git
cd crispinlab
hugo server -D
```

Open http://localhost:1313 — the site hot-reloads on every save.

---

## Deploying to GitHub Pages (free)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under "Source" select **GitHub Actions**
4. Push any change to `main` — the site builds and deploys automatically

Your site will be live at `https://YOUR-ORG.github.io/crispinlab/`  
(Or configure a custom domain like `crispinlab.com` under Settings → Pages → Custom domain)

---

## Editing content

All content lives in the `content/` folder as plain Markdown files.

| What to edit | File(s) |
|---|---|
| Homepage text / description | `hugo.toml` params section |
| Research themes | `layouts/index.html` (homepage) or add `content/research/*.md` |
| People | Add a `.md` file in `content/people/` |
| Publications | Edit `content/publications/_index.md` |
| News posts | Add a `.md` file in `content/news/` |
| Opportunities | Edit `content/opportunities/_index.md` |
| Environment / how we work | Edit `content/environment/_index.md` |
| Contact | Edit `content/contact/_index.md` |

### Adding a person

Create `content/people/firstname-lastname.md`:

```markdown
---
title: "Full Name"
role: "Postdoctoral Research Associate"
photo: "/images/people/firstname-lastname.jpg"
weight: 2
---

Short bio paragraph here.
```

Add their photo (square crop, min 400×400px) to `static/images/people/`.

### Adding a news post

Create `content/news/YYYY-MM-short-title.md`:

```markdown
---
title: "New paper published in Nature"
date: 2025-01-20
summary: "One-sentence summary shown on the news listing."
---

Full post content here in Markdown.
```

### Adding a publication

Each paper is one file in `data/papers/display/` (shown on the site) or `data/papers/context/` (hidden from lab lists, available to profiles). Copy an existing file and edit it — see `data/papers/README.yaml`. For a new paper with a DOI you can instead just paste the DOI into `data/new_papers.yaml`.

---

## Customising the design

| What to change | Where |
|---|---|
| Colours, fonts, spacing | `static/css/main.css` `:root` token block at the top |
| Lab name, tagline, email | `hugo.toml` `[params]` section |
| Navigation links | `hugo.toml` `[menu]` section |
| Homepage layout | `layouts/index.html` |
| Page templates | `layouts/_default/` |

### Key design tokens (in `static/css/main.css`)

```css
--accent: #0d6e6e;      /* teal — main brand colour */
--ink:    #1a1f2e;      /* near-black text */
--font-sans: 'Inter';   /* body font */
--font-serif: 'Lora';   /* headings font */
```

---

## Figures and scroll motion

**Figures in Markdown pages** — put the image in `static/images/research/`, then:

```markdown
{{</* paperfig src="/images/research/my-figure.webp" alt="What it shows"
    caption="Short caption." credit="Author et al., Journal 2025" doi="10.xxxx/xxxx" wide="true" */>}}
```

Only use published figures that are open access (CC BY) and always credit them.

**Scroll motion** (`static/js/motion.js` + `static/css/motion.css`) — add these attributes to any HTML element:

| Attribute | Effect |
|---|---|
| `data-reveal` | Fades/slides in when scrolled into view (`style="--i: 2"` staggers grid items) |
| `data-parallax="0.5"` | Drifts vertically while in view |
| `data-count="400" data-suffix="+"` | Counts up when in view |

The homepage hero, research story and synced strips are in `layouts/index.html`. Visitors with "reduce motion" turned on in their OS get a static page.

**Publications, posters & talks** — one YAML file per item in `data/papers/display/` (shown) or
`data/papers/context/` (hidden: theses, commentaries, papers without a lab first/last author). Each has a `type`
(article, review, conference, preprint, poster, talk, thesis), which drives the filter buttons on
/publications/. A poster/talk template is in `data/papers/README.yaml`; put poster PDFs in
`static/files/posters/`. `featured: true` puts a paper on the homepage.

**Personal publication lists** — `data/person_pubs/<person-file-name>.yaml` (e.g. `zeyu-gao.yaml`) holds a member's full
publication list (copied from their own website). It appears on their profile, merged with lab papers
and de-duplicated. Lab papers live in `data/papers/`.

**Environment page** — `content/environment/_index.md`. Sections marked `{{</* todo "..." */>}}`
show a "To be written" box; replace each with text. Photos use `{{</* photo src="/images/environment/x.jpg" caption="..." */>}}`
and show a placeholder until the file exists.

**Homepage text** — `data/home.yaml` (aim, focus areas, research themes, team intro, values).

The `inspiration/` folder (source PDFs) is git-ignored and never published.

---

## Adding funder logos

Drop SVG or PNG logos into `static/images/funders/`, then reference them in `layouts/index.html` in the funders section. Replace the placeholder text spans with:

```html
<a href="https://wellcome.org" target="_blank" rel="noopener">
  <img src="/images/funders/wellcome.svg" alt="Wellcome Trust" class="funder-logo">
</a>
```

---

## Project structure

```
crispinlab/
├── hugo.toml                  # Site config, params, menus
├── content/                   # All page content (Markdown)
│   ├── _index.md              # Homepage
│   ├── research/
│   ├── people/
│   ├── publications/
│   ├── news/
│   ├── opportunities/
│   └── contact/
├── layouts/                   # HTML templates
│   ├── _default/
│   │   ├── baseof.html        # Base layout (nav + footer)
│   │   ├── single.html        # Single page
│   │   └── list.html          # Section index (news, people, etc.)
│   ├── index.html             # Homepage
│   └── partials/
│       ├── nav.html
│       └── footer.html
├── static/
│   ├── css/main.css           # All styles
│   └── images/                # Photos, logos
└── .github/workflows/
    └── deploy.yml             # GitHub Actions → GitHub Pages
```

---

## What updates itself

| What | How | You need to… |
|---|---|---|
| **New papers** | paste a DOI into `data/new_papers.yaml` (+ `profiles:` to show it on people's pages); title/authors/journal are fetched from Crossref on every (daily) build | just add the DOI |
| **News page** | embeds the lab's LinkedIn posts via a feed widget | paste the widget embed code once into `layouts/partials/linkedin-widget.html` |
| **Job pop-up** | disappears after the closing date (daily rebuild) | edit `[params.vacancy]` in `hugo.toml` for new jobs |
| **People: selected work** | each profile shows the 2–4 items listed under `selected:` in `content/people/<name>.md` (a DOI, or a full entry for posters/talks) | members send their picks via `people-files/<name>/` |

To trigger an update immediately: GitHub → Actions → "Deploy to GitHub Pages" → **Run workflow**.
To refresh publications locally: `python3 scripts/update_publications.py`.

**University of Cambridge logo** — drop the official files into `static/images/cambridge/` (see the README there); they appear automatically on the homepage and footer.

**Gallery** — photos in `static/images/gallery/`, captions/order in `data/gallery.yaml`.
