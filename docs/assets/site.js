(function () {
  const NEWS_JSON_PATH = "data/news.json";
  const NEWS_JSON_URL =
    location.protocol === "file:"
      ? `../${NEWS_JSON_PATH}`
      : `https://raw.githubusercontent.com/OpenChatGit/News/main/${NEWS_JSON_PATH}`;

  const KIND_LABELS = {
    update: "Update",
    planned: "Planned",
    info: "Info",
  };

  const navEl = document.getElementById("news-nav");
  const articleEl = document.getElementById("news-article");
  const feedUpdatedEl = document.getElementById("news-feed-updated");

  if (!navEl || !articleEl) return;

  /** @type {Array<{ id: string; kind: string; title: string; description?: string }>} */
  let items = [];
  let activeId = null;
  let feedUpdatedAt = "";

  init().catch((error) => {
    console.error(error);
    articleEl.innerHTML =
      '<p class="news-empty">Could not load news. Please try again later.</p>';
  });

  window.addEventListener("hashchange", () => {
    const id = getArticleIdFromLocation();
    if (id && id !== activeId && items.some((item) => item.id === id)) {
      void showArticle(id);
    }
  });

  async function init() {
    const feed = await fetchNewsFeed();
    items = flattenItems(feed);
    feedUpdatedAt = feed.updatedAt || "";

    if (feedUpdatedEl && feedUpdatedAt) {
      feedUpdatedEl.textContent = `Feed updated ${feedUpdatedAt}`;
      feedUpdatedEl.hidden = false;
    }

    if (items.length === 0) {
      navEl.innerHTML = "";
      articleEl.innerHTML = '<p class="news-empty">No news items yet.</p>';
      return;
    }

    renderNav(items);

    const initialId = getArticleIdFromLocation();
    const id = initialId && items.some((item) => item.id === initialId)
      ? initialId
      : items[0].id;

    await showArticle(id);
  }

  async function fetchNewsFeed() {
    const response = await fetch(NEWS_JSON_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`news.json responded with ${response.status}`);
    }
    return response.json();
  }

  function flattenItems(feed) {
    return (feed.sections || []).flatMap((section) => section.items || []);
  }

  function getArticleIdFromLocation() {
    const hash = location.hash.replace(/^#/, "").trim();
    if (hash) return hash;

    const params = new URLSearchParams(location.search);
    return params.get("id") || params.get("article") || "";
  }

  function renderNav(newsItems) {
    navEl.innerHTML = "";

    for (const item of newsItems) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "news-nav__btn";
      button.textContent = item.title;
      button.dataset.id = item.id;
      button.addEventListener("click", () => {
        void showArticle(item.id);
      });
      navEl.appendChild(button);
    }
  }

  function setActiveNav(id) {
    for (const button of navEl.querySelectorAll(".news-nav__btn")) {
      button.classList.toggle("news-nav__btn--active", button.dataset.id === id);
    }
  }

  async function showArticle(id) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    activeId = id;
    setActiveNav(id);

    if (location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }

    document.title = `${item.title} · OpenChat`;
    articleEl.innerHTML = '<p class="news-empty">Loading…</p>';

    const markdown = await fetchMarkdown(item.id);
    const bodyHtml =
      typeof marked !== "undefined"
        ? marked.parse(markdown, { gfm: true, breaks: false })
        : `<pre>${escapeHtml(markdown)}</pre>`;

    const kind = item.kind || "info";
    const kindLabel = KIND_LABELS[kind] || "Info";
    const lead = item.description
      ? `<p class="lead">${escapeHtml(item.description)}</p>`
      : "";

    articleEl.innerHTML = `
      <header class="article-header">
        <h1>${escapeHtml(item.title)}</h1>
        <span class="badge badge--${escapeHtml(kind)}">${escapeHtml(kindLabel)}</span>
      </header>
      ${lead}
      <div class="prose">${bodyHtml}</div>
      ${feedUpdatedAt ? `<p class="meta">Updated ${escapeHtml(feedUpdatedAt)}</p>` : ""}
    `;
  }

  async function fetchMarkdown(id) {
    const response = await fetch(`articles/${id}.md`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`articles/${id}.md responded with ${response.status}`);
    }
    return response.text();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
