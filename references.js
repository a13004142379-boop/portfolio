(() => {
  "use strict";
  const grid = document.getElementById("referencesGrid");
  const dialog = document.getElementById("referenceDialog");
  const video = document.getElementById("referenceVideo");
  const error = document.getElementById("referenceError");
  let items = [], current = 0, previousOverflow = "";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const time = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  function show(index) {
    current = (index + items.length) % items.length;
    const item = items[current];
    video.pause(); error.hidden = true;
    document.getElementById("referencePosition").textContent = `参考视频 ${current + 1} / ${items.length}`;
    document.getElementById("referenceTitle").textContent = item.title;
    document.getElementById("referenceMeta").textContent = `${time(item.duration)} · ${item.tags}`;
    const source = document.getElementById("referenceSource");
    source.hidden = !item.source;
    if (item.source) source.href = item.source; else source.removeAttribute("href");
    video.poster = item.cover; video.src = item.video; video.load();
    video.play().catch(() => {});
  }
  function open(index) {
    previousOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = "hidden"; show(index);
    document.getElementById("referenceClose").focus();
  }
  dialog.addEventListener("close", () => {
    video.pause(); video.removeAttribute("src"); video.load();
    document.body.style.overflow = previousOverflow;
  });
  video.addEventListener("error", () => { if(dialog.open && video.hasAttribute("src")) error.hidden = false; });
  document.getElementById("referenceClose").addEventListener("click", () => dialog.close());
  document.getElementById("referencePrev").addEventListener("click", () => show(current - 1));
  document.getElementById("referenceNext").addEventListener("click", () => show(current + 1));
  grid.addEventListener("click", event => {
    const card = event.target.closest("[data-reference]");
    if(card) open(Number(card.dataset.reference));
  });
  fetch("references.json").then(response => {
    if(!response.ok) throw new Error("参考视频暂时无法加载");
    return response.json();
  }).then(data => {
    items = data;
    document.getElementById("referencesCount").textContent = `${items.length} 部`;
    grid.innerHTML = items.map((item, index) => `<button type="button" class="reference-card" data-reference="${index}" aria-label="播放参考视频：${esc(item.title)}"><div class="frame"><img src="${esc(item.cover)}" alt="${esc(item.title)}画面" loading="lazy"><span class="playdot"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l12 7-12 7z" fill="#0E0E0D"/></svg></span><span class="dur">${time(item.duration)}</span></div><div class="cap"><h3>${esc(item.title)}</h3><span class="tag">${String(index + 1).padStart(2,"0")}</span></div><p class="ref-tags">${esc(item.tags)}</p></button>`).join("");
  }).catch(() => { grid.innerHTML = '<p role="status">参考视频暂时无法加载，请刷新重试。</p>'; });
})();
