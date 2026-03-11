import { countTokens } from "@anthropic-ai/tokenizer";
import type { MessageTokenEntry } from "@marionette/shared";

/** Per-agent cursor: how many messages we have already tokenized */
const cursors = new Map<string, number>();

type ContentBlock = {
  type: string;
  text?: string;
  input?: unknown;
  content?: string | ContentBlock[];
};

type RawMessage = {
  role: string;
  content: string | ContentBlock[] | unknown;
};

function extractText(content: string | ContentBlock[] | unknown): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return (content as ContentBlock[])
    .map((block) => {
      if (block.type === "text") return block.text ?? "";
      if (block.type === "tool_use") return `[tool_use: ${JSON.stringify(block.input)}]`;
      if (block.type === "tool_result") {
        const inner = block.content;
        if (typeof inner === "string") return `[tool_result: ${inner}]`;
        if (Array.isArray(inner)) return `[tool_result: ${extractText(inner)}]`;
      }
      return "";
    })
    .join(" ")
    .trim();
}

/**
 * Tokenizes only the NEW messages in a conversation since the last call for this agent,
 * then appends the assistant response using the API-reported output_tokens (ground truth).
 *
 * Returns an array of MessageTokenEntry — one per new user message plus the assistant response.
 * Advances the cursor so subsequent calls do not re-count already-processed messages.
 */
export function tokenizeNewMessages(
  agentId: string,
  messages: RawMessage[],
  outputTokens: number,
): MessageTokenEntry[] {
  const lastSeen = cursors.get(agentId) ?? 0;

  // If message count shrank this is a new conversation — reset cursor
  if (messages.length < lastSeen) {
    cursors.set(agentId, 0);
  }

  const cursor = cursors.get(agentId) ?? 0;
  const newMessages = messages.slice(cursor);

  const entries: MessageTokenEntry[] = newMessages.map((msg, i) => {
    const text = extractText(msg.content);
    const tokens = countTokens(text);
    return {
      msg_index: cursor + i,
      role: msg.role === "user" ? "user" : "assistant",
      tokens,
    };
  });

  // Append the assistant response using accurate API-reported output_tokens
  entries.push({
    msg_index: messages.length,
    role: "assistant",
    tokens: outputTokens,
  });

  // Advance: all existing messages + the new assistant response
  cursors.set(agentId, messages.length + 1);

  return entries;
}

/** Exposed for testing only */
export function resetCursor(agentId: string): void {
  cursors.delete(agentId);
}
