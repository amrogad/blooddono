import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuArrowUp, LuDatabase, LuMessageCircle, LuX } from 'react-icons/lu';
import RequestDraftCard from './RequestDraftCard';
import { askAssistant } from '../services/assistantService';

// The model answers in markdown whatever the prompt asks, so replies were
// rendering with literal ** around the donor counts. Only bold and italic ever
// show up in practice, which is little enough to split by hand rather than pull
// in a markdown renderer and its escaping rules for four characters.
const formatReply = (text) =>
  text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });

const AssistantBubble = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const chips = t('assistant.chips', { returnObjects: true });

  useEffect(() => {
    // Skipped while empty so opening the panel doesn't jump straight to the
    // bottom before there is anything to scroll to.
    if (!open || messages.length === 0) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const history = messages.filter((m) => !m.failed);
    const next = [...history, { role: 'user', text: trimmed }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      // Only role and text go to the function; usedTool is display-only state.
      const data = await askAssistant(
        next.map(({ role, text: body }) => ({ role, text: body })),
        i18n.language === 'ar' ? 'ar' : 'en',
      );
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply,
          usedTool: (data.toolsUsed ?? []).includes('find_compatible_donors'),
          draft: data.draft ?? null,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: t('assistant.error'), failed: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('assistant.open')}
        className="fixed bottom-5 end-5 z-1100 flex h-14 w-14 items-center justify-center rounded-full bg-crimson text-white shadow-[0_12px_28px_-8px_rgba(156,14,46,0.6)] transition hover:bg-crimson-deep"
      >
        <LuMessageCircle size={24} />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={t('assistant.title')}
      className="fixed inset-x-3 bottom-3 top-20 z-1100 flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[0_28px_60px_-20px_rgba(33,20,22,0.45)] sm:inset-x-auto sm:top-auto sm:end-5 sm:h-[580px] sm:w-[400px]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-white">
          <LuMessageCircle size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-semibold tracking-tight text-ink">
            {t('assistant.title')}
          </p>
          <p className="truncate text-xs text-muted">{t('assistant.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t('assistant.close')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-ink"
        >
          <LuX size={17} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-body">{t('assistant.greeting')}</p>
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => send(chip)}
                className="rounded-xl border border-line bg-surface p-3 text-start text-[13px] text-body transition hover:border-crimson/40 hover:text-ink"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {messages.map((message, index) => (
          <Fragment key={index}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                message.role === 'user'
                  ? 'self-end bg-crimson text-white'
                  : 'self-start border border-line bg-surface text-body'
              }`}
            >
              {message.role === 'assistant' ? formatReply(message.text) : message.text}
              {message.usedTool && (
                <span className="mt-2 flex items-center gap-1.5 text-[11.5px] font-medium text-muted">
                  <LuDatabase size={12} />
                  {t('assistant.checkedDatabase')}
                </span>
              )}
            </div>
            {message.draft && <RequestDraftCard draft={message.draft} />}
          </Fragment>
        ))}

        {loading && (
          <div className="self-start rounded-2xl border border-line bg-surface px-4 py-3">
            <span className="loading loading-dots loading-sm text-muted" />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 rounded-xl border border-line-strong bg-card p-1.5"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('assistant.inputPlaceholder')}
            aria-label={t('assistant.inputPlaceholder')}
            disabled={loading}
            className="h-9 flex-1 rounded-lg bg-transparent px-2.5 text-[13.5px] text-ink placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label={t('assistant.sendA11y')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-crimson text-white transition hover:bg-crimson-deep disabled:bg-line-strong"
          >
            <LuArrowUp size={16} />
          </button>
        </form>
        <p className="mt-2 text-center text-[11.5px] italic text-muted">
          {t('assistant.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default AssistantBubble;
