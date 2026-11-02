(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const tiles = document.querySelectorAll(
    ".desk-stage .terminal-paper, .desk-stage .browser-paper",
  );
  const resets = [];
  tiles.forEach((tile) => {
    let frame = 0;
    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      tile.style.removeProperty("--paper-rx");
      tile.style.removeProperty("--paper-ry");
    }
    tile.addEventListener("pointermove", (event) => {
      if (reduced.matches || event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = tile.getBoundingClientRect();
        const x = Math.max(
          -1,
          Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1),
        );
        const y = Math.max(
          -1,
          Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1),
        );
        tile.style.setProperty("--paper-rx", `${-y * 2}deg`);
        tile.style.setProperty("--paper-ry", `${x * 2}deg`);
      });
    });
    ["pointerleave", "pointercancel", "blur", "click"].forEach((event) =>
      tile.addEventListener(event, reset),
    );
    resets.push(reset);
  });
  reduced.addEventListener("change", () => resets.forEach((reset) => reset()));
})();
