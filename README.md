# Weijie Zhou — Personal Website

Personal portfolio for Weijie Zhou, focused on NLP, large language models,
retrieval-augmented generation and knowledge-enhanced systems.

- Production: <https://jimzhou03.github.io/>
- Repository: <https://github.com/jimzhou03/jimzhou03.github.io>
- Technical handoff: [TECHNICAL_HANDOFF.md](./TECHNICAL_HANDOFF.md)

## Main routes

- `/` — profile, education, interactive black-hole field and selected projects
- `/projects` — interactive project universe
- `/projects/ai-teaching-assistant` — RAG + domain KG + BKT system case study
- `/projects/ccl25-hate-speech` — CCL25 Chinese hate-speech detection case study
- `/life` — dogs, campus landscapes and courtyard cat photo archive
- `/about` — short personal statement and contact information

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Open <http://127.0.0.1:3000/>.

## Validation

```bash
npm run lint
npm run build:pages
```

GitHub Actions sets `GITHUB_PAGES=true` and exports the static site to `out/`.
Every push to `main` triggers `.github/workflows/deploy-pages.yml`.
