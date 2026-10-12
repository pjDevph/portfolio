# Production readiness

Last updated: 2026-10-12. **Code-complete. Not production-validated** until the live integrations below are checked with real credentials.

## Status by component

| Component | Verified how | Status |
|-----------|--------------|--------|
| Pages, case studies, galleries, mobile menu | Browser tests at 1440 / 820 / 390 px: no horizontal overflow, 0 automated WCAG 2.1 A/AA violations, anchors clear the sticky bars | **Verified** |
| Build, typecheck, lint | `npm run ci` (22+ static pages, 0 lint errors) | **Verified** |
| HTTP smoke test (pages, metadata, share images, sitemap, API guard rails) | `npm run smoke`, 46 checks, no credentials needed | **Verified** |
| Secret scan (source and built client bundles) | `npm run check:secrets`; also proven to catch planted fake credentials | **Verified** |
| Portfolio Assistant: streaming, validation, rate limits, refusal and error handling, usage logging | Against a **stand-in model server** | **Verified against a simulation only** |
| Free answer-first FAQ (776 generated recruiter phrasings) | Offline test, no model: 98.7% answered by the right topic, 0 wrong-topic, open-ended and follow-up questions correctly routed to the AI | **Verified (offline)**. Tuned on the same topics as the 28-question eval, so treat the score as optimistic |
| Monthly budget guard ($2 default) and free fallback | Against stand-in servers: reserve/settle, exhaustion, provider failure, restart persistence (with Redis), zero budget | **Verified against a simulation only** |
| Portfolio Assistant: real answer quality, grounding, cost | Needs a real Anthropic key | **UNTESTED** |
| Redis-backed rate limits | Against a fake Upstash REST server (counts, hashing, outage fallback) | **Simulated only; not enabled** |
| Cloudflare Turnstile | Real Cloudflare **test** keys, both pass and fail paths, browser and server | **Verified with test keys; not enabled with real keys** |
| Contact form validation and spam trap | HTTP tests | **Verified** |
| Contact form email delivery and visitor auto-reply | Needs a Resend key and a verified sending domain | **UNTESTED** |
| Screen-reader and manual keyboard accessibility pass | Automated checks and scripted keyboard tests only | **UNTESTED by a human** |
| Athlete Central visuals | Only a poster exists | **Incomplete** |

## Before you launch

1. **Assistant**
   - Create an Anthropic key and set a monthly **spend limit** on it (match or exceed `MONTHLY_BUDGET_USD`, default $2). Set `ANTHROPIC_API_KEY` (server-side only). The default model is the cheapest, `claude-haiku-5-5`.
   - `npm run assistant:check` confirms the model id.
   - Run the evaluation (see `evals/assistant/README.md`): `ANTHROPIC_API_KEY=... EXPOSE_USAGE=1 FAQ_FIRST=0 npm run dev`, then `npm run assistant:eval`. **`FAQ_FIRST=0` is required**, otherwise common questions are answered free and the model is never tested. Read the saved transcripts; passing checks are necessary, not sufficient.
   - Check real cost per answer from the eval summary, then decide whether to keep Opus or set `ASSISTANT_MODEL` to a cheaper model after comparing quality.
2. **Abuse protection**: create an Upstash Redis database and set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. Create a Cloudflare Turnstile widget and set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Re-test the assistant on the deployed URL.
3. **Contact form**: create a Resend account, verify your sending domain, set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`. Send a real message and confirm both emails arrive. Check the spam folder.
4. **Site URL**: Vercel sets the production URL automatically; set `NEXT_PUBLIC_SITE_URL` if you use a custom domain, so share previews and the sitemap use it.
5. **Never set** `EXPOSE_USAGE` in production.
6. **Disclosure review**: confirm which FINDXNY details you are allowed to publish. The reporting case study describes architecture and behaviour only (no URLs, keys, workbook names, or business figures).

## Documentation PDFs

Each project has a preview page (`/docs/<slug>`) and a PDF (`public/docs/<slug>-documentation.pdf`), built from the same data as the case studies (`src/data/docs.ts`). After changing any project or automation content, regenerate them and commit `public/docs`:

```bash
npm run build && npm run build:docs    # needs Google Chrome
```

CI runs `npm run check:docs`, which fails if a PDF is missing or older than the content it was built from. The documents only contain what is already public on the site.

## Quality gates (CI)

`.github/workflows/ci.yml` runs `npm run ci`: typecheck, lint, evaluation-harness self-test, secret scan, build, secret scan of the built bundles, HTTP smoke test. It uses **no secrets** and makes no calls to Anthropic, Resend, Redis, or Cloudflare. If this folder is not the root of your git repository, move the `.github` folder to the repository root and set `working-directory` on the job.

Not in CI: browser accessibility tests and the live-API evaluation (both need either a browser install or secrets).

## Known issues and limits

- The assistant can be wrong; prompt-injection defences reduce risk but cannot remove it.
- Without Upstash configured, rate limits **and the monthly budget counter** are per server instance, so the provider-side spend limit is the real hard cap.
- The built-in FAQ only covers common questions; unusual wording goes to the AI, or to a polite "I don't have that" when the AI is off.
- The reporting case study documents code that had no automated tests in its repository, and says so.
- No usage, conversion, time-saved, or financial figures are claimed anywhere on the site.
