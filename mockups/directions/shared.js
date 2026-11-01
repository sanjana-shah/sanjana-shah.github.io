document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
const dialog = document.querySelector('#project-dialog');
const content = document.querySelector('[data-dialog-content]');
let opener;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  opener = button;
  content.innerHTML = projectContent[button.dataset.project];
  content.querySelector('h2').id = 'project-dialog-title';
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}));
document.querySelectorAll('[data-inline-project]').forEach(detail => detail.addEventListener('toggle', () => {
  if (detail.open && !detail.dataset.loaded) {
    detail.querySelector('.inline-content').innerHTML = projectContent[detail.dataset.inlineProject];
    detail.dataset.loaded = 'true';
  }
}));
document.querySelector('.close-dialog')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('close', () => {
  document.body.style.overflow = '';
  opener?.focus();
});
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});

function syncPreviewImages() {
  const mode = document.documentElement.dataset.theme === 'night' ? 'night' : 'day';
  document.querySelectorAll('[data-preview-layout]').forEach(img => {
    img.src = `previews/${img.dataset.previewLayout}-${mode}.png`;
  });
}
syncPreviewImages();
new MutationObserver(syncPreviewImages).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
