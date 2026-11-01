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
