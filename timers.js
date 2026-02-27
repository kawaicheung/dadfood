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

  // ─── Completion ───────────────────────────────────────────────────────────
  const pageEl   = document.querySelector('.page');
  const allCells = [...document.querySelectorAll('.section .cell')];

  const centerCell = (cell) => {
    if (!cell) return;
    const pageRect = pageEl.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    pageEl.scrollTo({
      left: pageEl.scrollLeft + cellRect.left - pageRect.left
        - (pageRect.width / 2) + (cellRect.width / 2),
      behavior: 'smooth',
    });
  };

  const updateCurrent = () => {
    const first = allCells.find(c => !c.classList.contains('is-complete'));
    allCells.forEach(c => c.classList.toggle('is-current', c === first));
    return first;
  };

  // Mark everything before i complete, everything from i onward incomplete
  const setCurrentAt = (i) => {
    allCells.slice(0, i).forEach(c => c.classList.add('is-complete'));
    allCells.slice(i).forEach(c => c.classList.remove('is-complete'));
    centerCell(updateCurrent());
  };

  allCells.forEach((cell, i) => {
    const btn = cell.querySelector('.complete-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const next = cell.classList.contains('is-complete') ? i : i + 1;
      setCurrentAt(next);
    });

    cell.addEventListener('click', (e) => {
      if (e.target.closest('.complete-btn')) return;
      setCurrentAt(i);
    });
  });

  updateCurrent();

  // ─── Sticky guideposts ────────────────────────────────────────────────────
  const sections = [...document.querySelectorAll('.section')];

  const tops = sections.map(s => {
    const gp = s.querySelector('.guidepost');
    return gp ? gp.getBoundingClientRect().top : 0;
  });

  const stickLeft = () =>
    parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--divider-margin')) || 20;

  const update = () => {
    const threshold = pageEl.getBoundingClientRect().left + stickLeft();
    sections.forEach((section, i) => {
      const gp = section.querySelector('.guidepost');
      if (!gp || gp.classList.contains('is-fixed')) return;
      if (section.getBoundingClientRect().left <= threshold) {
        gp.style.setProperty('--guidepost-top', tops[i] + 'px');
        gp.classList.add('is-fixed');
      }
    });
  };

  pageEl.addEventListener('scroll', update, { passive: true });
  update();
})();