# Three alternative layouts

These are standalone, buildless alternatives to the current portfolio, served by the same local server on port 8017. Developer’s desk is selected and promoted to `/`; `/mockups/` now redirects to it. These comparison pages remain available for reference.

- `/mockups/directions/`: comparison page, with previews that follow the selected mode.
- `/mockups/directions/home.html`: a compact personal introduction, a presently list, and a six-project index with native expandable details. The first photo sits beside the introduction and the second accompanies About.
- `/mockups/directions/desk.html`: an asymmetrical desk of notes, a photograph, a Hobbit bookmark, a presently note, two project previews, and four additional project links. Content rearranges into an orderly single column on mobile.
- `/mockups/directions/work.html`: a large Mausam feature with real screenshots, a five-project directory, experience, and a personal section with both photographs.

All layouts retain `#f6c500`, day/night modes, the supplied photographs, all six public projects, Meta and Amazon in Experience, the shared résumé page, and the Word résumé download. The existing `../theme.js` manages persisted preferences, keyboard-accessible switches, and mode-aware internal links. No new external dependencies or assets are required.

`projects.js` reuses the existing portfolio's project stories with relative asset paths adjusted. `shared.js` opens project dialogs, populates native expandable project entries, and synchronizes comparison thumbnails with the mode. Screenshots in `previews/` are captured from these actual pages.

Checked in Chrome in both modes at 375, 390, 768, 1024, and 1440 pixels wide, including the six project interactions in each layout, keyboard theme switches, local image loads, comparison navigation, and the shared résumé link.
