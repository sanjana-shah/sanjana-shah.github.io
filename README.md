# Sanjana Shah’s personal website

The selected design is **Developer’s desk**: notes, project postcards, photographs, and a little room for curiosity.

- `index.html`: homepage with six public projects and a separate experience section.
- `resume.html`: responsive résumé with a Word download.
- `assets/portfolio/`: local fonts, photos, project previews, theme controls, and page assets.
- `mockups/directions/`: retained layout studies for reference. The old `/mockups/` preview URL redirects to the selected homepage.

Run from the repository root:

```sh
python3 -m http.server 8017 --bind 127.0.0.1
```

Open http://127.0.0.1:8017/. No installation or build step is needed. Both pages share a persisted day/night preference and the selected yellow, `#f6c500`. The homepage’s “Back on IST” card shows live Indian Standard Time, identifies Ahmedabad as the current location, and makes the search for backend or infrastructure roles in India explicit. The Word résumé preserves the supplied résumé content.
