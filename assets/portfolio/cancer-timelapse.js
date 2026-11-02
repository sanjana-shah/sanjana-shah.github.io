/* An illustrative, reproducible agent model, not the CancerSim implementation.
 * Parameters below are chosen for legibility, not biological calibration.
 * Fixed vessels supply nutrients; nearby cells compete for that supply.
 * Division requires a free FCC neighbor. Resistance raises nutrient needs.
 * Sigmoid thresholds govern nutrient-driven division/starvation and drug death.
 * No real hours, dose units, or treatment efficacy are inferred from this loop.
 */
window.buildCancerTimelapse = (cells, vessels) => {
  let seed = 2023;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  const distance2 = (a, b) =>
    (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
  function segmentDistance(p, a, b) {
    const t = Math.max(
      0,
      Math.min(
        1,
        ((p.x - a.x) * (b.x - a.x) +
          (p.y - a.y) * (b.y - a.y) +
          (p.z - a.z) * (b.z - a.z)) /
          distance2(a, b),
      ),
    );
    return Math.sqrt(
      distance2(p, {
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y),
        z: a.z + t * (b.z - a.z),
      }),
    );
  }
  const neighbors = cells.map((c) =>
    cells
      .filter((n) => {
        const d = distance2(c, n);
        return d > 0.039 && d < 0.042;
      })
      .map((n) => n.id),
  );
  const supply = cells.map((c) =>
    Math.exp(
      -2.5 * Math.min(...vessels.map((v) => segmentDistance(c, v.a, v.b))),
    ),
  );
  let state = new Int8Array(cells.length);
  [...cells]
    .sort(
      (a, b) =>
        distance2(a, { x: 0, y: 0.1, z: 0 }) -
        distance2(b, { x: 0, y: 0.1, z: 0 }),
    )
    .slice(0, 24)
    .forEach((c, i) => (state[c.id] = i % 5 === 0 ? 2 : 1));
  // Two brief pulses, separated by a holiday, preserve sensitive competitors.
  const treatmentStart = 32;
  const treatmentEnd = 40;
  const secondTreatmentStart = 64;
  const phaseAt = (step) =>
    step < treatmentStart
      ? "growth"
      : step < treatmentEnd
        ? "treatment"
        : step < secondTreatmentStart
          ? "holiday"
          : "retreatment";
  const frames = [];
  function record(step, births, deaths) {
    frames.push({
      state: state.slice(),
      step,
      births,
      deaths,
      sensitive: state.reduce((n, x) => n + (x === 1), 0),
      resistant: state.reduce((n, x) => n + (x === 2), 0),
      phase: phaseAt(step),
    });
  }
  record(0, 0, 0);
  for (let step = 1; step <= 71; step++) {
    const next = state.slice();
    let births = 0,
      deaths = 0;
    const phase = phaseAt(step);
    const drug = phase === "treatment" || phase === "retreatment" ? 1 : 0;
    // Shuffle event order; newborn cells act on the next illustrative step.
    const order = cells.map((c) => c.id);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    for (const id of order) {
      const type = state[id];
      if (!type) continue;
      const demand = type === 2 ? 0.48 : 0.32;
      const competition =
        neighbors[id].reduce((sum, n) => sum + (next[n] ? 1 : 0), 0) * 0.025;
      const nutrient = Math.max(0, supply[id] - competition);
      const starvation = 0.06 * sigmoid((demand - 0.16 - nutrient) * 14);
      const drugDeath =
        drug * 0.26 * sigmoid((drug - (type === 2 ? 1.25 : 0.5)) * 10);
      if (random() < 1 - (1 - starvation) * (1 - drugDeath)) {
        next[id] = 0;
        deaths++;
        continue;
      }
      const free = neighbors[id].filter((n) => !next[n]);
      if (free.length && random() < 0.2 * sigmoid((nutrient - demand) * 12)) {
        const target = free[Math.floor(random() * free.length)];
        next[target] = type;
        births++;
      }
    }
    state = next;
    record(step, births, deaths);
  }
  return frames;
};
