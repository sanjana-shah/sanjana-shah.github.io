// Port of ComputerProject's tables and Yes/No branches.
// Corrected mF: omit 13 so it follows m2 -> m7 -> m10, rather than the leaf for 23.
// Numbers above 40 in the original question tables are intentionally retained.
const mindReaderTree = {
  start: [
    "1 2 4 5 6 7 9 11 12 13 14 16 17 19 20 21 22 23 24 26 28 29 31 32 33 35 36 37 38 40",
    "A",
    "B",
  ],
  A: [
    "3 4 5 7 8 10 11 13 14 15 17 18 22 23 24 25 27 29 30 31 33 34 36 38 39 41 43 44 45 46",
    "C",
    "D",
  ],
  B: [
    "1 2 4 5 6 7 8 9 11 12 13 16 17 18 20 21 23 24 26 27 29 31 33 34 35 36 37 38 39 41",
    "15",
    "16",
  ],
  C: [
    "1 2 3 4 6 7 11 12 14 15 18 19 20 21 25 26 29 30 32 34 35 36 37 38 39 40 41 42 43 44",
    "E",
    "F",
  ],
  D: [
    "1 3 4 5 6 7 8 9 10 11 12 13 15 17 18 19 21 22 23 26 27 28 29 30 31 33 35 36 39 40",
    "33",
    "34",
  ],
  E: [
    "1 2 3 4 6 8 10 12 15 16 18 19 20 22 23 24 26 28 29 30 31 32 35 36 37 39 40 41 42 43",
    "G",
    "H",
  ],
  F: [
    "1 2 3 5 6 7 8 9 10 11 14 16 17 18 20 21 23 25 26 27 30 31 32 34 35 36 37 38 39",
    "1",
    "2",
  ],
  G: [
    "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 17 18 19 21 22 23 24 25 27 28 29 30 31 32 35",
    "I",
    36,
  ],
  H: [
    "1 2 3 4 5 6 8 9 10 12 14 15 16 17 18 21 22 23 25 27 30 31 32 33 34 35 36 37 38 40",
    "61",
    "62",
  ],
  I: [
    "1 2 3 4 5 6 7 8 9 10 11 12 14 15 16 17 18 19 21 22 23 24 25 26 27 28 30 31 33 36",
    4,
    29,
  ],
  1: [
    "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 18 19 20 21 22 23 24 25 29 30 32 33 34 37",
    "3",
    "4",
  ],
  2: [
    "1 2 3 4 5 7 8 9 10 11 12 13 14 16 17 18 20 21 23 24 26 27 29 30 31 32 34 36 37 40",
    "7",
    "8",
  ],
  3: [
    "1 2 3 4 6 7 8 9 10 11 12 13 15 16 17 19 20 23 24 25 26 28 29 32 34 36 37 38 39 40",
    23,
    5,
  ],
  4: [
    "1 2 3 4 5 6 8 9 10 11 12 13 14 16 17 19 20 21 22 25 27 29 30 32 33 35 36 37 38 39",
    17,
    31,
  ],
  7: [
    "1 2 3 4 5 6 7 8 10 11 12 14 16 17 18 20 21 22 23 24 26 27 28 29 31 33 36 37 39 40",
    24,
    13,
  ],
  8: [
    "1 2 3 4 5 7 8 9 10 11 12 13 14 16 17 18 19 20 21 22 24 26 28 29 30 32 34 35 37 39",
    22,
    33,
  ],
  15: [
    "1 2 4 5 6 7 8 9 10 11 12 13 14 15 17 19 20 22 24 25 27 29 30 31 32 33 34 36 40 41",
    "17",
    "18",
  ],
  16: [
    "1 2 4 5 6 7 8 9 10 11 12 13 14 16 17 19 20 21 23 24 26 27 28 29 30 33 34 35 37 39",
    "25",
    "26",
  ],
  17: [
    "1 2 3 4 5 6 7 9 10 11 13 14 15 18 19 21 22 23 25 27 29 31 32 33 34 36 37 38 39 40",
    "19",
    8,
  ],
  18: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 21 22 24 25 27 28 30 31 33 34 35 37 38 40",
    18,
    39,
  ],
  19: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 17 18 20 22 23 24 25 27 28 30 31 32 33 35 36 37 38",
    27,
    34,
  ],
  25: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 21 23 24 25 26 27 28 29 31 33 34 35 37 39",
    10,
    30,
  ],
  26: [
    "1 2 4 5 6 7 8 9 10 11 12 13 14 15 17 18 20 21 23 26 27 28 30 31 33 34 35 37 38 40",
    15,
    "30",
  ],
  30: [
    "1 2 3 4 5 6 7 8 9 11 12 13 14 15 17 18 20 21 22 24 26 28 29 30 31 32 33 36 37 39",
    3,
    25,
  ],
  33: [
    "1 2 4 5 7 8 9 10 11 15 17 18 19 20 23 24 25 26 27 29 30 31 32 34 35 36 37 38 39 41",
    "35",
    "36",
  ],
  34: [
    "1 2 3 4 5 6 7 8 9 11 12 13 14 15 17 18 19 20 21 24 25 28 29 30 31 33 34 35 37 40",
    "53",
    "54",
  ],
  35: [
    "1 2 3 4 5 6 8 10 11 12 13 14 15 16 18 19 21 22 24 25 27 28 30 31 33 34 35 37 38 40",
    "37",
    "38",
  ],
  36: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 21 22 24 25 27 29 30 31 33 34 35 37 38 40",
    "45",
    "46",
  ],
  37: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 20 21 22 24 25 27 28 30 31 33 34 35 37 38 40",
    "39",
    19,
  ],
  38: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 21 22 24 25 27 28 30 31 33 34 35 37 38 40",
    9,
    26,
  ],
  39: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 21 22 24 25 27 28 30 31 33 34 36 37 38 40",
    1,
    35,
  ],
  45: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 21 22 24 25 27 28 30 31 33 34 35 37 38 41",
    "47",
    40,
  ],
  46: [
    "1 2 3 4 5 6 8 9 10 12 13 14 15 16 18 19 21 22 24 25 27 29 30 31 33 34 35 37 38 40",
    12,
    28,
  ],
  47: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 20 22 24 25 27 28 30 31 33 34 35 37 38 40",
    6,
    21,
  ],
  53: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 20 22 24 25 27 28 30 31 33 34 35 36 38 40",
    "55",
    37,
  ],
  54: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 21 22 24 25 27 28 30 31 33 34 35 37 38 40",
    16,
    32,
  ],
  55: [
    "1 3 4 5 6 7 8 9 10 11 13 14 15 16 18 19 20 22 24 25 27 28 30 31 33 34 35 37 38 40",
    20,
    2,
  ],
  61: [
    "1 2 3 4 5 6 8 9 10 11 13 14 15 16 18 19 21 22 24 25 27 28 30 31 33 34 35 37 39 40",
    14,
    38,
  ],
  62: [
    "1 2 3 4 5 6 7 9 10 12 13 14 15 16 18 19 21 22 24 25 27 28 30 31 33 34 35 37 38 40",
    7,
    11,
  ],
};
for (const node of Object.values(mindReaderTree))
  node[0] = node[0].split(" ").map(Number);

window.initMindReader = (root) => {
  let current = "intro";
  const history = [];
  const numberGrid = (numbers) =>
    `<div class="mind-number-grid" aria-label="Number table">${numbers.map((n) => `<span>${n}</span>`).join("")}</div>`;
  const allNumbers = Array.from({ length: 40 }, (_, i) => i + 1);
  function render(focus = true) {
    if (current === "intro") {
      root.innerHTML = `<div class="mind-game-meta">A LITTLE PARLOR TRICK / 01—40</div><h3 tabindex="-1" data-game-focus>Keep a number.<br><em>Keep it secret.</em></h3><p>Choose any number from 1 to 40. Don’t type it or click it—just keep it in your head, and stick with it.</p>${numberGrid(allNumbers)}<button type="button" class="mind-primary" data-game-action="start">I have my number <span aria-hidden="true">↗</span></button><p class="mind-fineprint">I’ll ask whether it appears in a few tables. You only need to answer yes or no.</p>`;
    } else if (typeof current === "number") {
      root.innerHTML = `<div class="mind-game-meta">${history.length} QUESTIONS LATER</div><h3 tabindex="-1" data-game-focus>Your number is…</h3><div class="mind-reveal" data-game-result>${current}</div><p>Was that the one you had in mind?</p><div class="mind-actions"><button type="button" class="mind-primary" data-game-action="restart">Play again ↺</button><button type="button" class="mind-secondary" data-game-action="back">Change last answer</button></div><details class="mind-how"><summary>How does it work?</summary><p>Each yes or no follows a branch of a decision tree, narrowing down your number. This follows the decision tree from my original Java game, adapted for the browser.</p></details>`;
    } else {
      root.innerHTML = `<div class="mind-game-meta">QUESTION ${history.length + 1} / KEEP THE SAME NUMBER</div><h3 tabindex="-1" data-game-focus>Is your number<br><em>in this table?</em></h3>${numberGrid(mindReaderTree[current][0])}<div class="mind-actions"><button type="button" class="mind-primary" data-game-action="yes">Yes, it’s here <kbd>Y</kbd></button><button type="button" class="mind-secondary" data-game-action="no">No, it isn’t <kbd>N</kbd></button></div><div class="mind-bottom"><button type="button" class="mind-text-button" data-game-action="back">← ${history.length ? "Previous table" : "Choose again"}</button><button type="button" class="mind-text-button" data-game-action="restart">Start over</button></div>`;
    }
    if (focus)
      root.querySelector("[data-game-focus]").focus({ preventScroll: true });
  }
  function act(action) {
    if (action === "start") current = "start";
    else if (action === "restart") {
      current = "intro";
      history.length = 0;
    } else if (action === "back")
      current = history.length ? history.pop() : "intro";
    else if (
      (action === "yes" || action === "no") &&
      typeof current === "string" &&
      mindReaderTree[current]
    ) {
      history.push(current);
      current = mindReaderTree[current][action === "yes" ? 1 : 2];
    } else return;
    render();
  }
  const click = (e) => {
    const button = e.target.closest("[data-game-action]");
    if (button) act(button.dataset.gameAction);
  };
  const key = (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key.toLowerCase();
    if ((key === "y" || key === "n") && mindReaderTree[current]) {
      e.preventDefault();
      act(key === "y" ? "yes" : "no");
    }
  };
  root.addEventListener("click", click);
  root.addEventListener("keydown", key);
  render(false);
  return () => {
    root.removeEventListener("click", click);
    root.removeEventListener("keydown", key);
  };
};
