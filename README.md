<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f1275146-cdb9-4011-ba35-df5e88eaa9e8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Publish Articles By API

Set `PUBLISH_API_KEY` in `.env`, then call:

```bash
curl -X POST http://localhost:3000/api/publish/articles \
  -H "Authorization: Bearer $PUBLISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "externalId": "wire-2026-05-04-001",
    "title": "Market Update",
    "content": "First paragraph.\n\nSecond paragraph.",
    "excerpt": "Short summary for cards.",
    "category": "Markets",
    "status": "Published",
    "author": "Wire Desk",
    "featuredImage": "/uploads/example.webp"
  }'
```

For bulk publishing, send `{ "articles": [ ... ] }` with up to 100 articles. `externalId` is optional but recommended so retries do not create duplicates.
