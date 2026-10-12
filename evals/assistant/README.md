# Portfolio assistant evaluation

28 questions in 7 categories (skills, contributions, architecture, experience,
automations, out-of-scope, injection) with deterministic checks. Passing checks is
necessary, not sufficient: read the saved transcripts too.

## Before launch (needs a real API key)

1. `ANTHROPIC_API_KEY=... npm run assistant:check` confirms the model id exists.
2. Terminal 1: `ANTHROPIC_API_KEY=... EXPOSE_USAGE=1 FAQ_FIRST=0 npm run dev`
   (`FAQ_FIRST=0` is essential: by default common questions are answered by the free built-in FAQ, which would
   stop this suite from ever testing the model. The runner flags any free answer as a failure to protect you.)
3. Terminal 2: `npm run assistant:eval` (add `--only=injection` to run one category).
4. Read `evals/assistant/results/*.json`. Fix the knowledge base or rules, rerun.
5. Compare models: restart step 2 with `ASSISTANT_MODEL=<other id>` and compare
   pass rate, per-answer cost and latency.

`npm test` needs no key and no network. It runs the checker self-test and the FAQ coverage test (776 generated
recruiter phrasings must be answered free by the right topic, and open-ended/follow-up questions must NOT be).
`npm run assistant:eval:selftest` alone needs no key either; it proves the checks themselves
accept good answers and reject bad ones.

To see how the free FAQ alone does on these 28 questions, start the server with no key and run
`npm run assistant:eval -- --allow-free`.

Keep Turnstile off (`TURNSTILE_SECRET_KEY` unset) for local runs.
