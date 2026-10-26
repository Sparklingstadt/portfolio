'use strict';

(() => {
  const clock = document.getElementById('clock');
  const fmt = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const tick = () => { clock.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 1000);

  const overlay = document.getElementById('overlay');
  const toggle = document.getElementById('grid-toggle');
  const setGrid = on => { overlay.hidden = !on; toggle.setAttribute('aria-pressed', String(on)); };
  toggle.addEventListener('click', () => setGrid(overlay.hidden));
  document.addEventListener('keydown', e => {
    if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !e.altKey && !e.target.closest('input, textarea, [contenteditable]')) setGrid(overlay.hidden);
  });

  const copy = document.getElementById('copy');
  const addr = document.getElementById('addr');
  copy.addEventListener('click', () => {
    const done = () => { copy.textContent = 'コピーしました'; copy.classList.add('done'); setTimeout(() => { copy.textContent = 'アドレスをコピー'; copy.classList.remove('done'); }, 2000); };
    const select = () => { const r = document.createRange(); r.selectNodeContents(addr); const s = getSelection(); s.removeAllRanges(); s.addRange(r); copy.textContent = '選択しました。コピーしてください'; };
    try { navigator.clipboard.writeText(addr.textContent).then(done, select); } catch { select(); }
  });
})();
