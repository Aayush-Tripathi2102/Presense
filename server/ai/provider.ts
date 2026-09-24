// AI provider abstraction — no part of the app may import an SDK directly.
// Phase 1 ships deterministic mock adapters clearly labeled as mock.

export interface AIProvider {
  name: string;
  generate(input: { prompt: string; context?: unknown }): Promise<{ text: string; mock: true }>;
  stream?(input: { prompt: string }): AsyncGenerator<string>;
  embed(input: { text: string }): Promise<{ vector: number[]; mock: true }>;
  classify(input: { text: string; labels: string[] }): Promise<{ label: string; mock: true }>;
  extract(input: { text: string; schema: string }): Promise<{ data: unknown; mock: true }>;
  analyze(input: { kind: string; payload: unknown }): Promise<{ result: unknown; mock: true }>;
}

export class MockAIProvider implements AIProvider {
  name = "mock";
  async generate(input: { prompt: string }) {
    return { text: `[MOCK AI — connect a provider to generate real output]\nPrompt was: ${input.prompt.slice(0, 200)}`, mock: true as const };
  }
  async embed() {
    return { vector: [0, 0, 0], mock: true as const };
  }
  async classify(input: { labels: string[] }) {
    return { label: input.labels[0] ?? "unknown", mock: true as const };
  }
  async extract() {
    return { data: {}, mock: true as const };
  }
  async analyze(input: { kind: string; payload: unknown }) {
    return { result: { kind: input.kind, mock: true, note: "Placeholder analysis — real provider not connected." }, mock: true as const };
  }
}

// Registry: add OpenAI/Anthropic adapters here later without touching callers.
export function getAIProvider(): AIProvider {
  return new MockAIProvider();
}

export type AIJobKind =
  | "website_analysis" | "competitor_analysis" | "keyword_research"
  | "content_generation" | "brand_voice_analysis" | "social_idea_generation"
  | "seo_audit" | "growth_plan_generation";
