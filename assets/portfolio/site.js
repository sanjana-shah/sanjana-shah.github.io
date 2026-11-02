document
  .querySelectorAll("[data-year]")
  .forEach((node) => (node.textContent = new Date().getFullYear()));
const dialog = document.querySelector("#project-dialog");
const content = document.querySelector("[data-dialog-content]");
let opener;
let disposeProject;
document.querySelectorAll("[data-project]").forEach((button) =>
  button.addEventListener("click", () => {
    opener = button;
    disposeProject?.();
    disposeProject = undefined;
    content.innerHTML = projectContent[button.dataset.project];
    const animationSlot = content.querySelector("[data-cancer-animation-slot]");
    if (animationSlot) {
      animationSlot.append(
        document
          .querySelector("#cancer-animation-template")
          .content.cloneNode(true),
      );
    }
    content.querySelector("h2").id = "project-dialog-title";
    dialog.showModal();
    if (animationSlot) {
      disposeProject = window.initCancerAnimation(
        animationSlot.querySelector("[data-cancer-animation]"),
      );
    }
    const mindGame = content.querySelector("[data-mind-game]");
    if (mindGame) disposeProject = window.initMindReader(mindGame);
    dialog.scrollTop = 0;
    document.body.style.overflow = "hidden";
  }),
);
document
  .querySelector(".close-dialog")
  ?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("close", () => {
  disposeProject?.();
  disposeProject = undefined;
  content.innerHTML = "";
  document.body.style.overflow = "";
  opener?.focus();
});
dialog?.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    dialog.close();
});
