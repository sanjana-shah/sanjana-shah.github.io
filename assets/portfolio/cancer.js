window.initCancerAnimation = (root) => {
  "use strict";

  if (!root) return;
  const canvas = root.querySelector("canvas"),
    ctx = canvas.getContext("2d"),
    stage = root.querySelector(".stage");
  if (!ctx) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reduced.matches,
    visible = true,
    time = 0,
    mode = "structure",
    elapsed = 0,
    last = 0,
    angle = 0.5,
    tilt = -0.22,
    zoom = 1,
    drag = false,
    px = 0,
    py = 0,
    manualCut = false,
    cutOverride = false,
    cut = 0,
    W = 0,
    H = 0;
  const cells = [],
    vessels = [];
  // Equal spheres on the parity-defined FCC lattice, cropped to spherical tissue.
  for (let x = -5; x <= 5; x++)
    for (let y = -5; y <= 5; y++)
      for (let z = -5; z <= 5; z++) {
        if ((x + y + z) % 2 !== 0 || x * x + y * y + z * z > 26) continue;
        cells.push({
          x: x * 0.142,
          y: y * 0.142,
          z: z * 0.142,
          r: 0.097,
          green: (x + 1) ** 2 + (z - 0.3) ** 2 < 5 && y < 3 && y > -4,
          id: cells.length,
        });
      }
  function branch(a, b, depth, seed) {
    vessels.push({ a, b, r: 0.021 + depth * 0.006, seed });
    if (depth <= 0) return;
    for (let j = 0; j < 2; j++) {
      let k = seed * 1.7 + j * 2.8;
      let end = {
        x: b.x + Math.sin(k) * (0.17 + depth * 0.025),
        y: b.y - 0.17 - depth * 0.013,
        z: b.z + Math.cos(k) * (0.16 + depth * 0.023),
      };
      branch(b, end, depth - 1, seed * 2 + j + 1);
    }
  }
  branch({ x: 0.04, y: 0.68, z: 0 }, { x: -0.04, y: 0.29, z: 0.02 }, 3, 1);
  branch({ x: 0.04, y: 0.48, z: 0 }, { x: 0.27, y: 0.22, z: 0.02 }, 2, 7);
  const snapshots = window.buildCancerTimelapse(cells, vessels);
  const lastStep = snapshots.length - 1;
  const scrubber = root.querySelector("[data-scrubber]");
  const legend = root.querySelector(".legend");
  const originalLegend = legend.innerHTML;
  const phases = {
    growth: [
      "1 / Drug off · growth",
      "Cells can divide into a free neighboring site when nutrients permit. Nearby cells compete for the same supply.",
    ],
    treatment: [
      "2 / Drug on · first pulse",
      "A short drug pulse reduces sensitive cells without clearing them out in this illustration. Resistant cells tolerate more drug, but require more nutrients.",
    ],
    holiday: [
      "3 / Drug off · recovery",
      "With the drug off, sensitive cells can regrow faster because they need fewer nutrients. As space fills, competition limits resistant cells. This is an illustrative schedule, not an optimized treatment.",
    ],
    retreatment: [
      "4 / Drug on · second pulse",
      "A second short pulse reduces the population again. Alternating treatment and recovery illustrates how tumor size can be kept in check while preserving sensitive competitors.",
    ],
  };
  scrubber.max = lastStep;
  const chart = root.querySelector("[data-population-chart]");
  const totals = snapshots.map((f) => f.sensitive + f.resistant);
  const maxPopulation = Math.ceil(Math.max(...totals) / 50) * 50;
  const chartX = (step) => 24 + (step / lastStep) * 352;
  const chartY = (n) => 89 - (n / maxPopulation) * 60;
  const svgNS = "http://www.w3.org/2000/svg";
  function chartElement(tag, attrs) {
    const el = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([key, value]) =>
      el.setAttribute(key, value),
    );
    chart.append(el);
    return el;
  }
  // Drug-on shading and the curve are revealed only as the timeline advances.
  const pulseBands = [];
  for (let step = 1; step <= lastStep; step++) {
    if (["treatment", "retreatment"].includes(snapshots[step].phase)) {
      pulseBands.push({
        step,
        el: chartElement("rect", {
          x: chartX(step - 0.5),
          y: 20,
          width: 352 / lastStep + 0.1,
          height: 69,
          fill: "#bf895b",
          opacity: 0,
        }),
      });
    }
  }
  chartElement("path", {
    d: "M24 20V89H376",
    fill: "none",
    stroke: "currentColor",
    opacity: 0.2,
  });
  const topLabel = chartElement("text", {
    x: 2,
    y: 25,
    "font-size": 9,
    fill: "currentColor",
  });
  topLabel.textContent = maxPopulation;
  const zeroLabel = chartElement("text", {
    x: 9,
    y: 92,
    "font-size": 9,
    fill: "currentColor",
  });
  zeroLabel.textContent = "0";
  const totalLine = chartElement("path", {
    fill: "none",
    stroke: "#67894f",
    "stroke-width": 2,
    "stroke-linejoin": "round",
  });
  const marker = chartElement("circle", { r: 3, fill: "#67894f" });
  function updateChart(step) {
    totalLine.setAttribute(
      "d",
      totals
        .slice(0, step + 1)
        .map((n, i) => `${i ? "L" : "M"}${chartX(i)},${chartY(n)}`)
        .join(" "),
    );
    marker.setAttribute("cx", chartX(step));
    marker.setAttribute("cy", chartY(totals[step]));
    pulseBands.forEach((b) =>
      b.el.setAttribute("opacity", b.step <= step ? 0.17 : 0),
    );
    chart.setAttribute(
      "aria-label",
      `Tumor-cell count through illustrative step ${step}: ${totals[step]} living cells. Shading marks drug-on steps.`,
    );
  }
  function updateTimeline() {
    const f = snapshots[Math.floor(elapsed)];
    root.querySelector("[data-step]").textContent = `${f.step} / ${lastStep}`;
    scrubber.value = f.step;
    updateChart(f.step);
    root.querySelector("[data-treatment]").textContent = phases[f.phase][0];
    root.querySelector("[data-explanation]").textContent = phases[f.phase][1];
    root.querySelector("[data-sensitive]").textContent = f.sensitive;
    root.querySelector("[data-resistant]").textContent = f.resistant;
    root.querySelector("[data-events]").textContent =
      `+${f.births} born / −${f.deaths} died this step`;
  }
  function resize() {
    const b = stage.getBoundingClientRect();
    W = b.width;
    H = b.height;
    const d = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * d;
    canvas.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    render();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  function project(p) {
    let x = p.x * Math.cos(angle) + p.z * Math.sin(angle),
      z = -p.x * Math.sin(angle) + p.z * Math.cos(angle);
    let y = p.y * Math.cos(tilt) - z * Math.sin(tilt);
    z = p.y * Math.sin(tilt) + z * Math.cos(tilt);
    let perspective = 3.8 / (3.8 - z);
    let scale = Math.min(W * 0.37, H * 0.405) * zoom * perspective;
    return { x: W * 0.5 + x * scale, y: H * 0.51 + y * scale, z, s: scale };
  }
  function mix(a, b, t) {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      z: a.z + (b.z - a.z) * t,
    };
  }
  function render() {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    let bg = ctx.createRadialGradient(
      W * 0.5,
      H * 0.46,
      10,
      W * 0.5,
      H * 0.5,
      H * 0.7,
    );
    bg.addColorStop(0, "#243e32");
    bg.addColorStop(0.6, "#142921");
    bg.addColorStop(1, "#0d1b18");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    // Fine orbital guides ground the specimen without suggesting a physical lattice boundary.
    ctx.strokeStyle = "#9dbea316";
    ctx.lineWidth = 0.7;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.ellipse(
        W * 0.5,
        H * 0.53,
        Math.min(W * 0.34, H * 0.37) + k * 22,
        H * 0.12 + k * 10,
        -0.16,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
    const commands = [];
    for (const c of cells) {
      let p = project(c);
      let slice = c.x * 0.7 + c.z * 0.7;
      let removed = slice > 0.08;
      let alpha = removed ? 1 - cut * 0.96 : 1;
      let life = 1;
      let phenotype = 0;
      if (mode === "timelapse") {
        const index = Math.floor(elapsed);
        const f = snapshots[index],
          prev = snapshots[Math.max(0, index - 1)];
        const blend =
          index === lastStep ? 1 : Math.min(1, (elapsed - index) * 2);
        const before = prev.state[c.id],
          after = f.state[c.id];
        phenotype = after || before;
        if (!phenotype) continue;
        life = !before ? 0.2 + 0.8 * blend : !after ? 1 - blend : 1;
        if (life < 0.01) continue;
        alpha *= life;
      }
      commands.push({ kind: "cell", p, c, alpha, life, phenotype });
    }
    for (const v of vessels) {
      let a = project(v.a),
        b = project(v.b);
      commands.push({ kind: "vessel", p: { z: (a.z + b.z) / 2 }, a, b, v });
    }
    commands.sort((a, b) => a.p.z - b.p.z);
    for (const o of commands) {
      if (o.kind === "cell") {
        let { p, c, alpha, life, phenotype } = o;
        let r = c.r * p.s * life;
        let depth = (p.z + 1) / 2;
        ctx.globalAlpha = alpha;
        const g = ctx.createRadialGradient(
          p.x - r * 0.35,
          p.y - r * 0.4,
          r * 0.03,
          p.x,
          p.y,
          r,
        );
        if (mode === "timelapse" && phenotype === 2) {
          g.addColorStop(0, "rgba(192,221,255,.95)");
          g.addColorStop(0.48, "rgba(90,147,222,.75)");
          g.addColorStop(0.86, "rgba(45,93,170,.45)");
          g.addColorStop(1, "rgba(168,205,255,.8)");
        } else if (mode === "timelapse" || c.green) {
          g.addColorStop(0, `rgba(223,249,181,${0.64 + depth * 0.14})`);
          g.addColorStop(0.48, "rgba(153,208,105,.48)");
          g.addColorStop(0.86, "rgba(95,158,74,.24)");
          g.addColorStop(1, "rgba(196,233,154,.6)");
        } else {
          g.addColorStop(0, `rgba(234,247,226,${0.34 + depth * 0.22})`);
          g.addColorStop(0.42, "rgba(174,204,183,.23)");
          g.addColorStop(0.88, "rgba(102,145,130,.12)");
          g.addColorStop(1, "rgba(202,226,208,.38)");
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = c.green ? "#cbefac55" : "#d7eada33";
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x - r * 0.25, p.y - r * 0.28, r * 0.57, 3.5, 4.8);
        ctx.strokeStyle = "#efffe334";
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        let { a, b, v } = o;
        let width = (v.r * (a.s + b.s)) / 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#401d17";
        ctx.lineWidth = width + 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        let g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        g.addColorStop(0, "#d47757");
        g.addColorStop(0.5, "#e6a17b");
        g.addColorStop(1, "#ae573e");
        ctx.strokeStyle = g;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.strokeStyle = "#ffdeb477";
        ctx.lineWidth = Math.max(0.7, width * 0.2);
        ctx.stroke();
        // Sparse moving tracers are visual guides, not computed flow.
        let t = (time * 0.22 + v.seed * 0.173) % 1;
        let p = project(mix(v.a, v.b, t));
        ctx.shadowColor = "#ffc59b";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#ffe6bb";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    // Label the revealed interior without obscuring the specimen.
    if (mode === "structure" && cut > 0.1) {
      const labelX = Math.min(W * 0.5 + Math.min(W * 0.22, 140), W - 140);
      ctx.fillStyle = `rgba(220,238,196,${cut * 0.7})`;
      ctx.font = "9px monospace";
      ctx.fillText("INTERIOR / FCC LATTICE", labelX, H * 0.45);
      ctx.strokeStyle = `rgba(220,238,196,${cut * 0.35})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(W * 0.5 + 65, H * 0.49);
      ctx.lineTo(labelX, H * 0.45 + 10);
      ctx.lineTo(Math.min(labelX + 115, W - 16), H * 0.45 + 10);
      ctx.stroke();
    }
    root.querySelector(".motion-line").style.transform =
      `scaleX(${mode === "timelapse" ? elapsed / lastStep : (time % 24) / 24})`;
  }
  let frame = 0;
  function status() {
    if (mode === "timelapse") {
      root.querySelector("[data-phase]").textContent = String(
        snapshots[Math.floor(elapsed)].sensitive +
          snapshots[Math.floor(elapsed)].resistant,
      );
      root.querySelector("[data-caption]").textContent = "Living cells";
      updateTimeline();
      return;
    }
    root.querySelector("[data-phase]").textContent = cut > 0.5 ? "02" : "01";
    root.querySelector("[data-caption]").textContent =
      cut > 0.5 ? "Inside the tissue" : "Whole tissue";
  }
  function tick(ts) {
    frame = 0;
    const dt = Math.min((ts - last) / 1000 || 0, 0.05);
    last = ts;
    if (!paused && visible) {
      time += dt;
      if (!drag) angle += dt * (mode === "timelapse" ? 0.035 : 0.13);
      if (mode === "timelapse") {
        elapsed = Math.min(lastStep, elapsed + dt * 2);
        if (elapsed === lastStep) paused = true;
      }
      const cyc = time % 24;
      const target = cutOverride
        ? manualCut
          ? 1
          : 0
        : cyc > 9 && cyc < 19
          ? 1
          : 0;
      cut =
        mode === "timelapse" ? 0 : cut + (target - cut) * Math.min(1, dt * 2);
      status();
      render();
      if (paused) sync();
      else schedule();
    }
  }
  function schedule() {
    if (!frame && !paused && visible) frame = requestAnimationFrame(tick);
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }
  function sync() {
    root.querySelector("[data-pause]").textContent = paused ? "Play" : "Pause";
    root.querySelector("[data-pause]").setAttribute("aria-pressed", paused);
    if (paused) stop();
    else schedule();
    render();
  }
  root.querySelector("[data-pause]").onclick = () => {
    if (mode === "timelapse" && elapsed === lastStep) elapsed = 0;
    paused = !paused;
    sync();
  };
  root.querySelector("[data-cut]").onclick = () => {
    cutOverride = true;
    manualCut = !manualCut;
    root.querySelector("[data-cut]").setAttribute("aria-pressed", manualCut);
    if (paused) {
      cut = manualCut ? 1 : 0;
      root.querySelector("[data-phase]").textContent = cut ? "02" : "01";
      root.querySelector("[data-caption]").textContent = cut
        ? "Inside the tissue"
        : "Whole tissue";
      render();
    }
  };
  root.querySelectorAll("[data-mode]").forEach((button) => {
    button.onclick = () => {
      mode = button.dataset.mode;
      root
        .querySelectorAll("[data-mode]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      root.querySelector(".cancer-timeline").hidden = mode !== "timelapse";
      root.querySelector("[data-cut]").hidden = mode === "timelapse";
      root.querySelector(".stage-title").textContent =
        mode === "timelapse" ? "An ecology in motion." : "Living architecture.";
      legend.innerHTML =
        mode === "timelapse"
          ? '<span><i class="dot green"></i>Sensitive</span><span><i class="dot blue"></i>Resistant</span><span><i class="dot red"></i>Vasculature</span>'
          : originalLegend;
      elapsed = 0;
      cut = 0;
      status();
      sync();
    };
  });
  scrubber.oninput = () => {
    paused = true;
    elapsed = Number(scrubber.value);
    status();
    sync();
  };
  root.querySelector("[data-restart]").onclick = () => {
    elapsed = 0;
    status();
    sync();
  };
  canvas.onpointerdown = (e) => {
    drag = true;
    px = e.clientX;
    py = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  };
  canvas.onpointermove = (e) => {
    if (!drag) return;
    angle += (e.clientX - px) * 0.008;
    tilt = Math.max(-0.8, Math.min(0.8, tilt + (e.clientY - py) * 0.005));
    px = e.clientX;
    py = e.clientY;
    render();
  };
  canvas.onpointerup = canvas.onpointercancel = () => (drag = false);
  canvas.addEventListener(
    "wheel",
    (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoom = Math.max(0.7, Math.min(1.4, zoom - e.deltaY * 0.001));
      render();
    },
    { passive: false },
  );
  root.querySelector(".hint").textContent =
    "DRAG TO EXPLORE · CTRL / ⌘ + SCROLL TO ZOOM";
  let inView = false;
  const intersectionObserver = new IntersectionObserver((es) => {
    inView = es[0].isIntersecting;
    visible = inView && !document.hidden;
    if (visible) schedule();
    else stop();
  });
  intersectionObserver.observe(canvas);
  function onVisibilityChange() {
    visible = inView && !document.hidden;
    if (visible) schedule();
    else stop();
  }
  function onMotionChange(e) {
    paused = e.matches;
    sync();
  }
  document.addEventListener("visibilitychange", onVisibilityChange);
  reduced.addEventListener("change", onMotionChange);
  sync();
  return () => {
    paused = true;
    stop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    reduced.removeEventListener("change", onMotionChange);
  };
};
