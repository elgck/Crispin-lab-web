# Media inbox — images for the website

Drop files here, then ask Claude to "add the images from media-inbox".
Nothing in this folder is published automatically, and its contents are excluded
from git — files only go on the site once they've been processed and placed in `static/`.

```
media-inbox/
  ct-scans/          high-resolution CT images (PNG/TIFF/DICOM-exported PNG)
  pathology-slides/  whole-slide image crops / thumbnails (PNG/TIFF/JPEG)
  group-photos/      lab group and lab-life photos (JPEG/PNG/HEIC)
  paper-figures/     high-resolution figures from lab papers (kept for later use)
```

For each file, add a short note (a .txt with the same name is fine) saying:
- **CT scans & pathology slides:** where the image comes from — a public dataset
  (e.g. KiTS23, TCGA, TCIA, CAMELYON) or a published open-access figure — and the
  credit/licence line to show.
- **Group photos:** a caption (event, date) and confirmation that everyone pictured
  is happy for it to be online.

⚠️ Data policy: only use scans and slides from **public repositories or published
figures**. Do not put internal or hospital patient images here, and make sure files
contain no patient identifiers (names, NHS/hospital numbers, dates of birth, burned-in
text or DICOM headers).
