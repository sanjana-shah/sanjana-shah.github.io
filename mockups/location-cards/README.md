# Five location-card studies

Compare all five at http://127.0.0.1:8017/mockups/location-cards/.

- `map`: folded world map with Seattle (Amazon), New York (Meta), and Ahmedabad (current location).
- `address`: forwarding-address slip showing the move from New York to Ahmedabad.
- `clock`: live Indian Standard Time display and clock, updated every 30 seconds.
- `luggage`: yellow luggage tag, with the next role explicitly located in India.
- `history`: readable workplace history ending in Ahmedabad, followed by the India job search.

Each has a preview in the selected desk layout at `desk.html?card=<key>`. Use the selector to change cards in place. The preview replaces the circular decorative stamp, restores the lighter introduction so the card carries the location message, and leaves the real homepage unchanged. Both modes, six project dialogs, and the shared résumé links remain available.

The map uses Natural Earth 1:110m country geometry (public-domain map data) from https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson. It is projected equirectangularly; city pins use approximate geographic coordinates. Connecting lines indicate the relationship between workplaces and the current location, not a specific travel itinerary. The map SVG is bundled locally in `cards.js`, so the preview does not require an external map service.

Verified in Chrome in both modes at 375, 390, 768, 1024, and 1440 pixels wide. Checks include all five cards, context selection, map paths, live clock rendering, navigation, and project dialogs. `previews/` contains browser screenshots of the cards.
