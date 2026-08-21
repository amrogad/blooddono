import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuArrowUp, LuDatabase, LuMessageCircle } from 'react-icons/lu';
import { askAssistant } from '../../services/assistantService';

const Assistant = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const chips = t('assistant.chips', { returnObjects: true });

  useEffect(() => {
    // Skipped while empty, otherwise this fires on mount and scrolls the page
    // header up underneath the sticky navbar. 'nearest' keeps it from yanking
    // the whole document when a reply lands.
    if (messages.length === 0) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading]);

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

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
          <LuMessageCircle size={18} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {t('assistant.title')}
          </h1>
          <p className="text-sm text-muted">{t('assistant.subtitle')}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3" role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => send(chip)}
                className="rounded-2xl border border-line bg-card p-4 text-start text-sm text-body transition hover:border-crimson/40 hover:text-ink"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              message.role === 'user'
                ? 'self-end bg-crimson text-white'
                : 'self-start border border-line bg-card text-body'
            }`}
          >
            {message.text}
            {message.usedTool && (
              <span className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-muted">
                <LuDatabase size={13} />
                {t('assistant.checkedDatabase')}
              </span>
            )}
          </div>
        ))}

        {loading && (
          <div className="self-start rounded-2xl border border-line bg-card px-4 py-3">
            <span className="loading loading-dots loading-sm text-muted" />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-center text-[12.5px] italic text-muted">
          {t('assistant.disclaimer')}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-2xl border border-line bg-card p-2 shadow-[0_1px_2px_rgba(33,20,22,0.04)]"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('assistant.inputPlaceholder')}
            aria-label={t('assistant.inputPlaceholder')}
            disabled={loading}
            className="h-11 flex-1 rounded-xl bg-transparent px-3 text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label={t('assistant.sendA11y')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-crimson text-white transition hover:bg-crimson/90 disabled:bg-line-strong"
          >
            <LuArrowUp size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
