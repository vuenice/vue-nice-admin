import { defineStore } from 'pinia';
import { chatApi, type ChatMessage, type LlmStatus } from '../api/chat';

interface ChatState {
  open: boolean;
  status: LlmStatus | null;
  messages: ChatMessage[];
  sending: boolean;
  error: string | null;
  abortController: AbortController | null;
}

const OPEN_KEY = 'vuenice-admin:chat-open';

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    open:
      typeof window !== 'undefined' &&
      window.localStorage?.getItem(OPEN_KEY) === '1',
    status: null,
    messages: [],
    sending: false,
    error: null,
    abortController: null,
  }),

  getters: {
    isConfigured: (s) => s.status?.configured === true,
  },

  actions: {
    setOpen(open: boolean) {
      this.open = open;
      if (typeof window !== 'undefined') {
        window.localStorage?.setItem(OPEN_KEY, open ? '1' : '0');
      }
    },

    toggleOpen() {
      this.setOpen(!this.open);
    },

    async refreshStatus() {
      try {
        this.status = await chatApi.status();
      } catch {
        this.status = { configured: false };
      }
    },

    async send(content: string) {
      const text = content.trim();
      if (!text || this.sending) return;
      this.error = null;
      this.messages.push({ role: 'user', content: text });
      const assistant: ChatMessage = { role: 'assistant', content: '' };
      this.messages.push(assistant);
      this.sending = true;
      this.abortController = new AbortController();

      try {
        let streamed = false;
        for await (const delta of chatApi.streamChat(this.messages.slice(0, -1), {
          signal: this.abortController.signal,
        })) {
          streamed = true;
          assistant.content += delta;
        }
        if (!streamed) {
          // Backend doesn't support streaming → fall back to a one-shot.
          const reply = await chatApi.send(this.messages.slice(0, -1));
          assistant.content = reply.content;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Chat failed';
        this.error = message;
        // Surface the error in the conversation instead of silently dropping it.
        assistant.content = assistant.content || `_${message}_`;
      } finally {
        this.sending = false;
        this.abortController = null;
      }
    },

    cancel() {
      this.abortController?.abort();
    },

    clear() {
      this.messages = [];
      this.error = null;
    },
  },
});
