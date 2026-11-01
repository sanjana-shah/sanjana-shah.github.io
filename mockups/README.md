# Personal portfolio

Sanjana Shah’s responsive portfolio with Day (Sunshine) and Night (After hours) modes. The selected Developer’s desk design is now the repository homepage. `/mockups/` redirects to it; previous designs remain for reference.

From the repository root:

```sh
python3 -m http.server 8017 --bind 127.0.0.1
```

Open http://localhost:8017/mockups/. The header slider switches between two modes:

- `?mode=day`: Sunshine — umbrella yellow, warm paper, and expressive typography.
- `?mode=night`: After hours — deep green-charcoal with the same umbrella-yellow accent.

The Field Notes visual direction has been removed. Personal field notes remain part of About. Both modes use the same content. The accessible switch supports keyboard controls and remembers the selected mode across reloads, the résumé page, and other open tabs using local storage. Explicit mode URLs override the saved preference. Earlier `?concept=sunshine` and `?concept=night` links redirect to the corresponding mode in place.

## Proposed information architecture

1. **Introduction:** name, current professional identity, concise positioning, personal photo, and selected-work link.
2. **Selected work:** public builds, research, and playful experiments. Include research alongside engineering. Each project should explain the problem, personal contribution, technical decisions, and outcome. The preview opens project details in accessible native dialogs; finished case studies could have dedicated URLs.
3. **Experience:** current role first, a compact chronological history, and one or two meaningful results for each role. Group earlier internships so they do not dominate newer experience.
4. **About:** personal interests, teaching, and education in a short human introduction. A standalone education tab is unnecessary for the homepage.
5. **Contact:** email, LinkedIn, and updated résumé.

Keep navigation simple: Work / Experience / About / Contact. Add a writing section only if there are pieces to publish. Keep full career detail in the résumé.

## Visual reasoning

The shared accent is `#F6C500`, the yellow selected for the site. Both modes and the résumé page inherit the same `--umbrella-yellow` token. The second photograph has darker lighting, so its canopy appears more muted.

The supplied umbrella photo provides the palette: umbrella yellow, warm coat and paper neutrals, charcoal pavement, and muted green. One recognizable accent ties navigation, calls to action, illustrations, and section transitions together. The reference is https://www.annacorinneproductions.com/; the interpretation uses its bold color and playful typographic energy with an engineering portfolio structure.

Both umbrella photos are supplied originals: the first anchors the hero and the second appears in About. CancerSim and DEVS project thumbnails are illustrative CSS compositions; original project images appear inside the detail dialogs. Mausam uses original screenshots from its repository in both its card and detail dialog. Sanjana Eye Hospital uses a screenshot of the published website. No image generation or external image service is required. Fonts are served locally.

## Updated content

The preview now targets backend and infrastructure engineering roles in India. It includes Meta (Mar 2024–Aug 2026), three Amazon summer internships (2021–2023), exact ASU degree dates, skills, Women in Computer Science leadership, current email and phone, location, relocation, and immediate availability from the supplied résumé.

Projects now includes six public builds: Mausam, Sanjana Eye Hospital, CancerSim, DEVS-Suite, Trends of Oppression Against Women, and Chase the Pizza. Meta appears only in professional Experience and the résumé, alongside brief background in the introduction. Mausam supports both Engineering and Play filters. Its description and two screenshots come from https://github.com/sanjana-shah/mausam. Existing thesis details come from the original portfolio; Meta and the other updated career details come from the supplied résumé. Estimated infrastructure savings remain explicitly labeled as estimated.

`resume.html` is a responsive résumé web page preserving the supplied résumé content. It inherits the selected mode and provides section navigation. `assets/Sanjana-Shah-Resume.docx` is a genuine editable Word document generated from the supplied content, linked from the résumé page, Experience, and the footer. The site no longer links to the previous PDF. Print styles are retained for browser printing. Mausam appears on the portfolio but is not added to the supplied résumé content.

The personal introduction, About copy, presently list, field notes, and current toolbox draw on the supplied GitHub profile README. The website is the current “making” item. The profile’s wording about main quests, sidequests, and rediscovering curiosity informs the tone. The two photos connect the personal sections through the yellow umbrella.

## Preview behavior

Mode selection updates the shareable URL. Project filters update the visible cards and announce the result to assistive technology. Project and planning dialogs support Escape, close buttons, backdrop dismissal, and returning focus. Native anchor navigation, reduced motion support, and mobile layouts are included. The preview is marked `noindex` and has no analytics, framework, or build step.

Verified in Chrome at desktop and mobile/tablet widths, including the day/night switch, all project dialogs, project filters, the planning dialog, and local asset loading.

## Alternative layouts

Three separate alternatives are available at `/mockups/directions/`: a personal corner, a developer's desk, and a work-first portfolio. See `directions/README.md` for routes and implementation notes. These retain the selected color and shared day/night preference. Developer’s desk has been selected and promoted to the repository homepage.
