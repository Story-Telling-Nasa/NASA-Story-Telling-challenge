(() => {
  const SCORE_KEY = "spaceQuizScoresV1";
  const NAME_KEY = "spaceQuizPlayerNameV1";
  const list = document.getElementById("leaderboard-list");
  const empty = document.getElementById("leaderboard-empty");
  const count = document.getElementById("leaderboard-count");
  const form = document.getElementById("player-form");
  const input = document.getElementById("player-name");
  const status = document.getElementById("player-status");
  const clean = value => String(value || "").trim().replace(/\s+/g, " ").slice(0, 20);
  function getScores() {
    try { return JSON.parse(localStorage.getItem(SCORE_KEY)) || {}; }
    catch (_) { return {}; }
  }
  function render() {
    const entries = Object.entries(getScores()).sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]));
    list.innerHTML = "";
    count.textContent = entries.length + (entries.length === 1 ? " explorer" : " explorers");
    empty.hidden = entries.length > 0;
    entries.forEach(([name, score], index) => {
      const li = document.createElement("li"); li.className = "leaderboard-row";
      const rank = document.createElement("span"); rank.className = "leaderboard-rank";
      rank.textContent = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "#" + (index+1);
      const player = document.createElement("strong"); player.className = "leaderboard-player"; player.textContent = name;
      const points = document.createElement("span"); points.className = "leaderboard-points"; points.textContent = score + " pts";
      li.append(rank, player, points); list.appendChild(li);
    });
  }
  input.value = localStorage.getItem(NAME_KEY) || "";
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = clean(input.value);
    if (!name) return;
    localStorage.setItem(NAME_KEY, name);
    const scores = getScores();
    if (!(name in scores)) scores[name] = 0;
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
    status.textContent = "Player name saved: " + name;
    render();
  });
  render();
})();