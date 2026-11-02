# Sanjana Shah’s personal website

Live at **https://sanjana-shah.github.io/**.

A static portfolio styled as a developer’s desk, with six public projects, separate professional experience, a résumé page, and a live IST clock. Day/night preferences are shared across both pages. The accent color is `#f6c500`.

The “Listening lately” card reads the public last-played endpoint at `https://spotify-last-played.netlify.app/.netlify/functions/last-played`. It shows “Playing now” only when `playing` is true, otherwise “Last played,” with the track, artist, album, artwork, and supplied track link. It refreshes once a minute while the page is visible and retains the last known track if a refresh fails. No player or automatic audio is loaded.

The endpoint permits the production origin, `https://sanjana-shah.github.io`. Local browser testing needs either a development origin allowed by the endpoint or a recorded response; no proxy or credentials are included in this repository.

## Files

- `index.html`: homepage.
- `resume.html`: readable online résumé.
- `Sanjana_Shah_Resume.pdf`: the supplied PDF, used by every résumé download link.
- `assets/portfolio/`: local fonts and licenses, photographs, project previews, styles, and scripts.
- `images/`: four original project images used in the project details.

## Local preview

From the repository root:

```sh
python3 -m http.server 8017 --bind 127.0.0.1
```

Open http://127.0.0.1:8017/. No installation or build step is required.

## Publishing

GitHub Pages serves the root of the `main` branch. Pushing changes to `main` updates the website. `.nojekyll` keeps deployment static.

To update the downloadable résumé, replace `Sanjana_Shah_Resume.pdf` in the repository root. Edit `resume.html` separately when the online résumé content changes.
