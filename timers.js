(() => {
  // ─── Timers ───────────────────────────────────────────────────────────────
  const fmt = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const setTime = (targetId, minutes) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.textContent = fmt(new Date(Date.now() + minutes * 60 * 1000));
  };

  document.querySelectorAll('.reset-btn, .cell-reset-btn').forEach((btn) => {
    const { minutes, target } = btn.dataset;
    setTime(target, Number(minutes));
    btn.addEventListener('click', () => setTime(target, Number(minutes)));
  });

  // ─── Sticky-forever guideposts ────────────────────────────────────────────
  const page     = document.querySelector('.page');
  const sections = [...document.querySelectorAll('.section')];

  // Capture each guidepost's fixed top position once (stage is vertically
  // centred in .page, so this is stable — read after layout settles)
  const tops = sections.map(s => {
    const gp = s.querySelector('.guidepost');
    return gp ? gp.getBoundingClientRect().top : 0;
  });

  const stickLeft = () => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--divider-margin').trim();
    return parseFloat(raw) || 20;
  };

  const update = () => {
    const threshold = page.getBoundingClientRect().left + stickLeft();
    sections.forEach((section, i) => {
      const gp = section.querySelector('.guidepost');
      if (!gp) return;
      const left = section.getBoundingClientRect().left;
      if (left <= threshold && !gp.classList.contains('is-fixed')) {
        gp.style.setProperty('--guidepost-top', tops[i] + 'px');
        gp.classList.add('is-fixed');
      }
    });
  };

  page.addEventListener('scroll', update, { passive: true });
  update();
})();