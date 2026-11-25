# People files — drop-box for each lab member

Each person has a folder here. Drop in anything you'd like to appear on the
website, then ask Claude (or whoever maintains the site) to "update the site
from people-files" — the files are read and the relevant pages are updated.

```
people-files/
  <person>/
    papers/    PDFs of papers, or a .txt/.md with the DOI or citation
    posters/   poster PDFs/images from symposiums & conferences
               (add a .txt with event name, place and date if not on the poster)
    talks/     slides or a .txt with talk title, event and date
    photos/    profile photo (square works best) or lab-life photos
    other/     anything else — awards, a new bio, links (ORCID, Scholar, GitHub…)
```

What happens when the site is updated:
- **papers / posters / talks** → the person's 2–4 picks go under `selected:` in their profile
  (papers by DOI; posters/talks as full entries). Lab papers appear on /publications/
  automatically from Mireia's ORCID, so they don't need sending.
  Poster PDFs are copied to `static/files/posters/` only if you say they can be public.
- **photos** → cropped to a square and saved to `static/images/people/<person>.jpg`.
- **other** → used to update `content/people/<person>.md` (bio, links, interests).

Nothing in this folder is published automatically, and its contents are excluded
from git (see .gitignore) — so unpublished drafts stay private.

Please do not put patient-identifiable information (names, NHS/hospital numbers,
dates of birth, clinical notes) in these folders.
