import { IntegrationRequired } from "../../components/IntegrationRequired";

export default function AIChatScreen() {
  return (
    <IntegrationRequired
      badge="AI Assistant"
      title="AI chat simulation removed"
      description="The mobile AI assistant must call the production web API, which should be backed by Groq or OpenAI with product, order, customs, and support context from the database."
      requirements={[
        "Call /api/ai-chat with authenticated user context and persisted chat history.",
        "Use real LLM provider credentials and log token usage, latency, and failures.",
        "Ground product recommendations in Supabase marketplace data.",
        "Apply compliance safeguards for customs, payments, refunds, and regulated cargo advice.",
      ]}
    />
  );
}
