# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Markdown for AI agents

The public homepage has two representations backed by the same structured
content in `lib/site-content.ts`:

- `/` returns the existing HTML page for browser requests.
- `/` with `Accept: text/markdown` returns clean Markdown.
- `/index.md` returns the same Markdown directly.
- `/llms.txt` provides concise discovery links for agents.

The web app currently has one public content page, so it is the only
Markdown-enabled canonical page. Unsupported and missing `.md` paths return a
Markdown 404 instead of exposing an unrelated route. API, framework asset, and
discovery routes are excluded from negotiation.

Manual verification:

```bash
curl -i http://localhost:3000/

curl -i http://localhost:3000/ \
  -H "Accept: text/markdown"

curl -i http://localhost:3000/index.md

curl -i http://localhost:3000/llms.txt
```

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
