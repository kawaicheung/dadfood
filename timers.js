(() => {
  const fmt = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const setTime = (targetId, minutes) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.textContent = fmt(new Date(Date.now() + minutes * 60 * 1000));
  };

  const initBtn = (btn) => {
    const { minutes, target } = btn.dataset;
    setTime(target, Number(minutes));
    btn.addEventListener('click', () => setTime(target, Number(minutes)));
  };

  document.querySelectorAll('.reset-btn, .cell-reset-btn').forEach(initBtn);
})();