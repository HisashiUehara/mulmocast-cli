export const llmAgents = ["openAIAgent", "anthropicAgent", "geminiAgent", "groqAgent"];

const defaultModels = {
  anthropicAgent: "claude-3-7-sonnet-20250219",
  geminiAgent: "gemini-1.5-flash",
  groqAgent: "llama3-8b-8192",
  openAIAgent: "gpt-4o",
};

export const llmPair = (_agent?: string, _model?: string) => {
  const agent = llmAgents.includes(_agent) ? _agent : "openAIAgent";
  const model = _model ?? defaultModels[agent];

  return { agent, model };
};
