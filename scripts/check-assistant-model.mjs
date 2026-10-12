// Confirms the configured model id exists and prints its limits, using the Models API.
// Needs ANTHROPIC_API_KEY (or an `ant auth login` profile). Run: npm run assistant:check
import Anthropic from "@anthropic-ai/sdk";

// Keep in sync with ASSISTANT_MODEL's default in src/lib/assistant.ts.
const model = process.env.ASSISTANT_MODEL || "claude-haiku-5-5";
try {
  const info = await new Anthropic().models.retrieve(model);
  console.log(`OK  ${info.id} (${info.display_name})`);
  console.log(`    context window: ${info.max_input_tokens} tokens, max output: ${info.max_tokens} tokens`);
} catch (err) {
  const status = err instanceof Anthropic.APIError ? err.status : "n/a";
  console.error(`FAILED to retrieve model "${model}" (status ${status}): ${err instanceof Error ? err.message : err}`);
  console.error("Check ASSISTANT_MODEL against the live model list: client.models.list()");
  process.exit(1);
}
