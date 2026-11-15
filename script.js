(() => {
  const KEY = 'explorerBadges';
  const BADGES = {
    1: 'Rover', 2: 'Pioneer', 3: 'Orbiter', 4: 'Navigator', 5: 'Explorer'
  };
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  };
  const save = (list) => {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage blocked: badges last until refresh */ }
  };
  let earned = load();

  /* ---- Story pages: "Mark as read" button ---- */
  const finishBtn = document.querySelector('.finish-btn');
  if (finishBtn) {
    const n = Number(finishBtn.dataset.story);
    const msg = document.querySelector('.finish-msg');
    const sync = () => {
      const on = earned.includes(n);
      finishBtn.setAttribute('aria-pressed', on);
      finishBtn.classList.toggle('done', on);
      finishBtn.textContent = on ? 'Undo' : 'Mark as read';
      msg.textContent = on ? `Well done! You earned the ${BADGES[n]} badge.` : '';
    };
    finishBtn.addEventListener('click', () => {
      earned = load();
      earned = earned.includes(n) ? earned.filter((x) => x !== n) : [...earned, n];
      save(earned);
      sync();
    });
    sync();
  }

  /* ---- Home page: badge shelf ---- */
  const badges = document.querySelectorAll('.badge');
  if (badges.length) {
    const progress = document.getElementById('badge-progress');
    const detail = document.getElementById('badge-detail');
    const render = () => {
      earned = load();
      badges.forEach((b) => {
        const on = earned.includes(Number(b.dataset.story));
        b.classList.toggle('earned', on);
        b.querySelector('.badge-state').textContent = on ? 'Earned' : 'Locked';
      });
      progress.textContent = earned.length === badges.length
        ? 'All 5 badges earned. You read every story!'
        : `${earned.length} of ${badges.length} badges earned.`;
    };
    badges.forEach((b) => b.addEventListener('click', () => {
      const n = Number(b.dataset.story);
      detail.textContent = earned.includes(n)
        ? `${BADGES[n]}: you earned this by reading Story ${n}.`
        : `${BADGES[n]}: read Story ${n}, then press "Mark as read" at the end to earn it.`;
    }));
    document.getElementById('badge-reset').addEventListener('click', () => {
      save([]);
      detail.textContent = 'Badges cleared. Read a story to earn them again.';
      render();
    });
    window.addEventListener('pageshow', render);   // updates when you come back from a story
    render();
  }
})();