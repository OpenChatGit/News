## What this is

OpenChat can show short announcement cards on the welcome screen. The cards are loaded from a JSON file in the [OpenChatGit/News](https://github.com/OpenChatGit/News) repository, so copy and messaging can change without shipping a new desktop build.

The JSON feed only carries a **short summary** per item (title, one-line description, card styling). The full write-up lives here in Markdown.

## How it works in the app

1. On launch (and when you open the news row), the desktop client fetches `data/news.json` from GitHub.
2. Cards render below the centered composer on the welcome screen.
3. Tapping a card opens the matching article on GitHub Pages (`/#<id>`).

That split keeps the in-app preview lightweight while still giving room for longer notes when needed.

## What you see on the card vs. here

| In the app (JSON) | On this page (Markdown) |
| --- | --- |
| Title | Same title in the header |
| One-line `description` | Shown as the lead paragraph |
| Background image / scrim | Not repeated here |
| — | Sections, lists, links, code samples |

Example feed entry shape:

```json
{
  "id": "news-experiment",
  "kind": "info",
  "title": "News feature (test)",
  "description": "Short summary for the card only.",
  "url": "https://openchatgit.github.io/News/#news-experiment"
}
```

## Experiment status

> This news section is only an experiment. It will probably be removed again in a future update.

If the experiment does not prove useful, the UI entry point and feed loader may be removed. Treat everything in this feed as temporary.

### Open questions

- Is the card row useful on the welcome screen?
- Should articles stay on GitHub Pages or move in-app eventually?
- How often should the feed update without feeling noisy?
