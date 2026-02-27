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

  const COMPLETE = 'is-complete';

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
    const first = allCells.find(c => !c.classList.contains(COMPLETE));
    allCells.forEach(c => c.classList.toggle('is-current', c === first));
    return first;
  };

  const dividerMargin = () =>
    parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--divider-margin')) || 20;

  // The section after the last cell-containing section
  const lastCellSection = allCells[allCells.length - 1]?.closest('.section');
  const nextSection = lastCellSection?.nextElementSibling?.classList.contains('section')
    ? lastCellSection.nextElementSibling
    : lastCellSection?.nextElementSibling?.nextElementSibling; // skip .divider

  const scrollToNextSection = () => {
    if (!nextSection) return;
    const pageRect = pageEl.getBoundingClientRect();
    const sectionRect = nextSection.getBoundingClientRect();
    pageEl.scrollTo({
      left: pageEl.scrollLeft + sectionRect.left - pageRect.left - dividerMargin(),
      behavior: 'smooth',
    });
  };

  const setCurrentAt = (i) => {
    allCells.slice(0, i).forEach(c => c.classList.add(COMPLETE));
    allCells.slice(i).forEach(c => c.classList.remove(COMPLETE));
    const current = updateCurrent();
    if (current) {
      centerCell(current);
    } else {
      scrollToNextSection();
    }
  };

  allCells.forEach((cell, i) => {
    const btn = cell.querySelector('.complete-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const next = cell.classList.contains(COMPLETE) ? i : i + 1;
      setCurrentAt(next);
    });

    cell.addEventListener('click', (e) => {
      if (e.target.closest('.complete-btn')) return;
      setCurrentAt(i);
    });
  });

  // ─── Section scroll (Gather + Serve) ─────────────────────────────────────
  document.querySelectorAll('[data-scroll-section]').forEach((el) => {
    el.addEventListener('click', () => {
      const section = el.closest('.section');
      if (!section) return;
      const pageRect = pageEl.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      pageEl.scrollTo({
        left: pageEl.scrollLeft + sectionRect.left - pageRect.left - dividerMargin(),
        behavior: 'smooth',
      });
    });
  });

  updateCurrent();

})();