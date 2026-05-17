<template>
  <div class="ai-panel">
    <header class="ai-panel__head">
      <strong>Ask AI</strong>
      <span class="vn-spacer" />
      <button v-if="chat.messages.length" class="ai-panel__icon-btn" @click="chat.clear()" title="Clear">⟲</button>
      <button class="ai-panel__icon-btn" @click="chat.setOpen(false)" title="Close">×</button>
    </header>

    <div v-if="!chat.status" class="ai-panel__state vn-muted">
      Checking LLM availability…
    </div>

    <div v-else-if="!chat.isConfigured" class="ai-panel__state">
      <VnAlert variant="info">
        <strong>LLM not configured.</strong>
        <div>{{ chat.status.hint || 'Add an API key on the server to enable chat.' }}</div>
      </VnAlert>
      <p class="vn-muted" style="font-size:12px; margin-top:var(--vn-space-3)">
        The chat call goes through your backend at
        <code>POST /api/admin/llm/chat</code>. See
        <code>BACKEND_CONTRACT.md</code>.
      </p>
    </div>

    <template v-else>
      <div ref="messagesEl" class="ai-panel__messages vn-scroll">
        <div v-if="!chat.messages.length" class="ai-panel__empty vn-muted">
          <p>Start a conversation. The assistant has context for this admin panel.</p>
        </div>
        <article
          v-for="(msg, i) in chat.messages"
          :key="i"
          :class="['msg', `msg--${msg.role}`]"
        >
          <div class="msg__avatar">{{ msg.role === 'user' ? 'You' : 'AI' }}</div>
          <div class="msg__bubble">{{ msg.content || (chat.sending && i === chat.messages.length - 1 ? '…' : '') }}</div>
        </article>
      </div>

      <footer class="ai-panel__compose">
        <textarea
          ref="inputEl"
          v-model="draft"
          rows="2"
          placeholder="Message the assistant…"
          @keydown.enter.exact.prevent="onSend"
          @keydown.enter.shift.exact="() => {}"
          :disabled="chat.sending"
        />
        <div class="vn-row">
          <span class="vn-muted" style="font-size:11px">
            <kbd>Enter</kbd> to send · <kbd>Shift</kbd>+<kbd>Enter</kbd> newline
          </span>
          <span class="vn-spacer" />
          <VnButton
            v-if="chat.sending"
            variant="ghost"
            size="sm"
            @click="chat.cancel()"
          >
            Stop
          </VnButton>
          <VnButton
            size="sm"
            :loading="chat.sending"
            :disabled="!draft.trim() || chat.sending"
            @click="onSend"
          >
            Send
          </VnButton>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { VnAlert, VnButton } from './fallbacks';
import { useChatStore } from '../stores/chat';

const chat = useChatStore();
const draft = ref('');
const messagesEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLTextAreaElement | null>(null);

onMounted(() => {
  if (!chat.status) chat.refreshStatus();
});

async function onSend() {
  const text = draft.value;
  if (!text.trim()) return;
  draft.value = '';
  await chat.send(text);
  await nextTick();
  scrollToBottom();
  inputEl.value?.focus();
}

function scrollToBottom() {
  const el = messagesEl.value;
  if (el) el.scrollTop = el.scrollHeight;
}

watch(() => chat.messages.map(m => m.content).join('|'), () => {
  nextTick(scrollToBottom);
});
</script>

<style scoped>
.ai-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--vn-ai-bg);
}
.ai-panel__head {
  display: flex;
  align-items: center;
  gap: var(--vn-space-2);
  height: var(--vn-topbar-height);
  padding: 0 var(--vn-space-4);
  border-bottom: 1px solid var(--vn-color-border);
}
.ai-panel__icon-btn {
  background: transparent;
  border: 0;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--vn-radius-sm);
  color: var(--vn-color-text-muted);
}
.ai-panel__icon-btn:hover { background: var(--vn-color-surface-2); }

.ai-panel__state { padding: var(--vn-space-4); }

.ai-panel__messages {
  flex: 1 1 auto;
  padding: var(--vn-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--vn-space-3);
  min-height: 0;
}
.ai-panel__empty {
  margin: auto 0;
  text-align: center;
  font-size: 13px;
}

.msg {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: var(--vn-space-2);
  align-items: flex-start;
}
.msg__avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--vn-radius-md);
  background: var(--vn-color-surface-2);
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vn-color-text-muted);
}
.msg--user .msg__avatar { background: var(--vn-color-primary); color: var(--vn-color-primary-contrast); }
.msg__bubble {
  background: var(--vn-color-surface-2);
  padding: 8px 12px;
  border-radius: var(--vn-radius-md);
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
  line-height: 1.5;
}
.msg--user .msg__bubble {
  background: color-mix(in srgb, var(--vn-color-primary) 12%, transparent);
}

.ai-panel__compose {
  border-top: 1px solid var(--vn-color-border);
  padding: var(--vn-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--vn-space-2);
}
.ai-panel__compose textarea {
  width: 100%;
  resize: none;
  padding: 8px 10px;
  border-radius: var(--vn-radius-md);
  border: 1px solid var(--vn-color-border);
  background: var(--vn-color-surface);
  color: var(--vn-color-text);
  font: inherit;
  font-size: 13px;
  outline: none;
}
.ai-panel__compose textarea:focus {
  border-color: var(--vn-color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vn-color-primary) 25%, transparent);
}
kbd {
  background: var(--vn-color-surface-2);
  border-radius: 3px;
  padding: 1px 4px;
  font-family: var(--vn-font-mono);
  font-size: 10px;
}
code {
  font-family: var(--vn-font-mono);
  font-size: 11px;
  background: var(--vn-color-surface-2);
  padding: 1px 4px;
  border-radius: 3px;
}
</style>
