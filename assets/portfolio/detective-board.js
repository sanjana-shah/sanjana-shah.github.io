(() => {
  const surface = document.querySelector(".board-surface"),
    svg = document.querySelector(".board-threads");
  if (!surface || !svg) return;
  const links = [
    ["profile", "photo"],
    ["photo", "mausam"],
    ["photo", "cancer"],
    ["photo", "hospital"],
    ["cancer", "mindreader"],
  ];
  function draw() {
    const rect = surface.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    svg.replaceChildren();
    for (const [a, b] of links) {
      const point = (name) => {
        const p = surface
          .querySelector(`[data-board="${name}"] .board-pin`)
          .getBoundingClientRect();
        return {
          x: p.x + p.width / 2 - rect.x,
          y: p.y + p.height / 2 - rect.y,
        };
      };
      const p = point(a),
        q = point(b);
      const path = document.createElementNS(svg.namespaceURI, "path");
      path.setAttribute(
        "d",
        `M${p.x} ${p.y}Q${(p.x + q.x) / 2} ${(p.y + q.y) / 2 + 14} ${q.x} ${q.y}`,
      );
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#8c3d32");
      path.setAttribute("stroke-width", "1.65");
      path.setAttribute("opacity", ".8");
      svg.append(path);
    }
  }
  new ResizeObserver(draw).observe(surface);
  document.fonts.ready.then(draw);
  draw();
})();
