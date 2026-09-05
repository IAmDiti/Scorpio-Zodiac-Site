import Anthropic from '@anthropic-ai/sdk'

// The daily horoscope runs once per day and is reused for every visitor, so
// the spend is trivial; use the strongest model.
export const MODEL = 'claude-opus-5'

let _client

export function anthropic() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }
  _client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _client
}

/**
 * Ask Claude for a JSON object that conforms to `schema`.
 *
 * - Structured outputs guarantee the response is valid JSON matching the schema.
 * - Server-side fallback retries a rare policy refusal on a substitute model.
 * - Adaptive thinking lets the model reason about which transits matter.
 */
export async function completeJSON({ system, user, schema, effort = 'medium', maxTokens = 6000 }) {
  const res = await anthropic().beta.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: { effort, format: { type: 'json_schema', schema } },
    system,
    messages: [{ role: 'user', content: user }],
  })

  if (res.stop_reason === 'refusal') {
    throw new Error('The model declined to generate this content.')
  }

  const text = res.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')

  return { data: JSON.parse(text), model: res.model, usage: res.usage }
}
