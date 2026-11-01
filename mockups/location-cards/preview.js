const validCards = Object.keys(locationCards);
const selector = document.querySelector('#card-choice');
const params = new URL(location.href).searchParams;
let selected = validCards.includes(params.get('card')) ? params.get('card') : 'map';
function fillCards() {
  document.querySelectorAll('[data-location-card]').forEach(holder => {
    const key = holder.dataset.locationCard || selected;
    holder.innerHTML = locationCards[key];
  });
  if (selector) selector.value = selected;
  updateClocks();
}
function updateClocks() {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false}).format(now);
  document.querySelectorAll('[data-ist-time]').forEach(node => {
    node.textContent = time;
    node.dateTime = now.toISOString();
  });
  const india = new Date(now.getTime() + 330 * 60000);
  const minutes = india.getUTCMinutes();
  const hours = india.getUTCHours() % 12;
  document.querySelectorAll('[data-clock-hour]').forEach(hand => hand.setAttribute('transform', `rotate(${hours * 30 + minutes / 2} 50 50)`));
  document.querySelectorAll('[data-clock-minute]').forEach(hand => hand.setAttribute('transform', `rotate(${minutes * 6} 50 50)`));
}
fillCards();
setInterval(updateClocks, 30000);
selector?.addEventListener('change', () => {
  selected = validCards.includes(selector.value) ? selector.value : 'map';
  const url = new URL(location.href);
  url.searchParams.set('card', selected);
  history.replaceState(null, '', url);
  fillCards();
});
