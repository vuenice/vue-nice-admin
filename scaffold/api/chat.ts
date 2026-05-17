import { api } from './client';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmStatus {
  configured: boolean;
  provider?: 'anthropic' | 'openai' | 'custom' | string;
  model?: string;
  /** Optional one-line hint shown to the user when not configured. */
  hint?: string;
}

export const chatApi = {
  /** Whether the backend has an LLM key wired up for the current user. */
  status: () =>
    api.get<LlmStatus>('/api/admin/llm/status').then((r) => r.data),

  /**
   * Non-streaming completion. Returns the assistant message.
   *
   * Backends that prefer streaming should implement the SSE variant at
   * the same path with `Accept: text/event-stream`; see `streamChat` below.
   */
  send: (messages: ChatMessage[]) =>
    api
      .post<{ reply: ChatMessage }>('/api/admin/llm/chat', { messages })
      .then((r) => r.data.reply),

  /**
   * Streaming completion via Server-Sent Events. Yields incremental
   * `delta` strings. Cancellation: pass `AbortSignal` in `opts.signal`.
   *
   * Expected SSE event payload from the backend:
   *   data: { "delta": "...text..." }
   *   data: [DONE]
   */
  async *streamChat(
    messages: ChatMessage[],
    opts: { signal?: AbortSignal } = {}
  ): AsyncGenerator<string, void, void> {
    const res = await fetch('/api/admin/llm/chat', {
      method: 'POST',
      credentials: 'include',
      signal: opts.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ messages, stream: true }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`LLM chat failed: ${res.status} ${res.statusText}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const chunk = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') return;
          try {
            const obj = JSON.parse(payload) as { delta?: string };
            if (obj.delta) yield obj.delta;
          } catch {
            // ignore malformed events
          }
        }
      }
    }
  },
};
