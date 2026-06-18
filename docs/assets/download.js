(function () {
  const CONTENT_PATH = "download-content.md";
  const contentEl = document.getElementById("download-content");

  if (!contentEl) return;

  configureMarkdownParser();

  loadContent().catch((error) => {
    console.error(error);
    contentEl.innerHTML = '<p class="news-empty">Could not load page content.</p>';
  });

  function configureMarkdownParser() {
    if (typeof marked === "undefined") return;

    marked.setOptions({
      gfm: true,
      breaks: false,
    });
  }

  async function loadContent() {
    const response = await fetch(CONTENT_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`${CONTENT_PATH} responded with ${response.status}`);
    }

    const markdown = await response.text();
    contentEl.innerHTML = renderMarkdown(markdown);
  }

  function renderMarkdown(markdown) {
    const normalized = markdown.replace(/^\uFEFF/, "").trim();

    if (typeof marked === "undefined") {
      return `<pre>${escapeHtml(normalized)}</pre>`;
    }

    return enhanceProseHtml(marked.parse(normalized));
  }

  function enhanceProseHtml(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");

    for (const anchor of doc.body.querySelectorAll("a")) {
      const href = anchor.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      }
    }

    return doc.body.innerHTML;
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
