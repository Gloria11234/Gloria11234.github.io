# Gloria Darnell — Portfolio & Resume

Live site: **https://gloria11234.github.io/**

A static portfolio (GitHub Pages, no build step) with a one-page resume whose
certification badges link straight to each verifiable certificate.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | Portfolio home: credentials, experience, expertise, contact |
| `certificates/*.html` | One page per certificate; these are the pages the resume PDF links to |
| `resume.html` | Source for the one-page resume (letter size, print-tuned) |
| `assets/Gloria-Darnell-Resume.pdf` | Public resume PDF (no phone number) linked from the site |
| `assets/certificates/` | Certificate images (`.jpg`), thumbnails (`-thumb.jpg`), and PDFs |
| `assets/og-card.png` | Preview image shown when the link is shared |
| `tools/build_resume.py` | Rebuilds the resume PDFs from `resume.html` |

## Updating the resume

1. Edit `resume.html`.
2. Rebuild the PDFs (needs Chrome or Edge; `pip install pymupdf` adds a one-page check):

   ```bash
   py tools/build_resume.py
   ```

   This writes the public PDF to `assets/` and, if `private/phone.txt` exists, a second copy
   with the phone number to `private/Gloria-Darnell-Resume.pdf`. `private/` is git-ignored,
   so the phone number never reaches GitHub. Send the private copy to employers directly.
3. Commit and push. GitHub Pages redeploys in about a minute.

## Adding a certificate

1. Put `new-slug.jpg`, `new-slug-thumb.jpg` (760px wide), and `new-slug.pdf` in `assets/certificates/`.
2. Copy one of the pages in `certificates/` to `certificates/new-slug.html` and update its title,
   issuer, facts, and file names.
3. Add a card to the credentials grid in `index.html` and a badge to the strip in `resume.html`,
   then rebuild the PDF.

## Upcoming renewals

- ISSA Certified Personal Trainer and ISSA Nutritionist expire **Dec 6, 2026**.
  After renewing, replace the certificate files and update the dates in `index.html`,
  the two certificate pages, and `resume.html`.
- ISSA CPR & AED: recommended renewal **Apr 30, 2027**.
- Missouri Notary commission runs through **May 31, 2030**.
