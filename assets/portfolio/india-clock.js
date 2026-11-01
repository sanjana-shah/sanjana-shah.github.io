(() => {
  const display = document.querySelector('[data-ist-time]');
  if (!display) return;
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  const hourHand = document.querySelector('[data-clock-hour]');
  const minuteHand = document.querySelector('[data-clock-minute]');
  let timer;
  function updateClock() {
    const now = new Date();
    const parts = formatter.formatToParts(now);
    const hour = Number(parts.find(part => part.type === 'hour').value);
    const minute = Number(parts.find(part => part.type === 'minute').value);
    display.textContent = formatter.format(now);
    display.dateTime = now.toISOString();
    hourHand.setAttribute('transform', `rotate(${(hour % 12) * 30 + minute / 2} 50 50)`);
    minuteHand.setAttribute('transform', `rotate(${minute * 6} 50 50)`);
    clearTimeout(timer);
    timer = setTimeout(updateClock, 60000 - Date.now() % 60000 + 50);
  }
  updateClock();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateClock();
  });
})();
