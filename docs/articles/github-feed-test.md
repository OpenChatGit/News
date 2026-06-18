## Remote feed architecture

The desktop app reads `data/news.json` from GitHub on launch and when you open the news row. Card backgrounds can point to images, GIFs, or videos hosted anywhere reachable from the client.

The JSON file is intentionally small: **summaries for cards only**. Longer explanations, architecture notes, and links belong in these Markdown articles under `docs/articles/`.

## Repository layout

```
News/
  data/
    news.json          ← feed summaries (app + hub nav)
  news-assets/         ← card backgrounds
  docs/
    articles/*.md      ← full articles (this page)
    index.html         ← GitHub Pages hub
```

## Loading behaviour

- **Production:** the app fetches the raw JSON from `main/data/news.json`.
- **Development:** Vite proxies `/news-remote` to the same raw URL (avoids CORS preflight issues).
- **Media:** external wallpaper URLs may be proxied in dev / via Tauri in production for hotlink safety.

When you change copy:

1. Edit `data/news.json` for card title, summary, and visuals.
2. Edit `docs/articles/<id>.md` for the full article body.
3. Push to `main` — no desktop rebuild required for text changes.

## GitHub Pages hub

Full articles are rendered on [openchatgit.github.io/News](https://openchatgit.github.io/News/). The hub loads the same JSON for the left nav and fetches `articles/<id>.md` for the main content area.

Each card’s `url` field should point to `https://openchatgit.github.io/News/#<id>` so deep links open the correct article.

## Test feed disclaimer

> Updates are loaded from an external repository while we test this feature — **not** a permanent part of OpenChat yet.

This setup exists to validate remote configuration, caching, and article linking before we decide whether news stays in the product long term.

**Repository:** [github.com/OpenChatGit/News](https://github.com/OpenChatGit/News)
