import { Bot, Send, Sparkles, UserRound } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { chatService } from '../services/services';

const STORAGE_KEY = 'mirleft_chat_history';
const BACKEND_DISABLED_KEY = 'mirleft_chat_backend_disabled';

function normalizeLang(lang) {
  const value = String(lang || '').toLowerCase();

  if (value.startsWith('ar')) return 'ar';
  if (value.startsWith('fr')) return 'fr';
  return 'en';
}

function safeParseHistory(rawValue, fallback) {
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function createWelcomeMessage(t) {
  return {
    role: 'assistant',
    text: t('chatbot.welcome'),
  };
}

export default function Assistant() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState(() => [createWelcomeMessage(t)]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const suggestedPrompts = useMemo(
    () => [
      t('chatbot.prompts.surfSpots'),
      t('chatbot.prompts.stayLegzira'),
      t('chatbot.prompts.seafoodRestaurants'),
      t('chatbot.prompts.dayTripIdeas'),
    ],
    [t]
  );

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);

    if (savedHistory) {
      const parsedHistory = safeParseHistory(savedHistory, []);
      if (parsedHistory.length > 0) {
        setMessages(parsedHistory);
        return;
      }
    }

    setMessages([createWelcomeMessage(t)]);
  }, [t]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text = input) {
    const message = text.trim();

    if (!message || loading) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', text: message }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const backendDisabled = localStorage.getItem(BACKEND_DISABLED_KEY) === '1';
      const lang = normalizeLang(i18n.language);

      if (backendDisabled) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: t('chatbot.serverError'),
          },
        ]);
        return;
      }

      const history = nextMessages.slice(-10).map((item) => ({
        role: item.role,
        content: item.text,
      }));

      const { data } = await chatService.send(message, {
        lang,
        history,
      });

      const reply =
        data?.reply?.trim?.() || data?.reply || t('chatbot.noResponse');

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          mode: data?.mode || 'fallback',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: t('chatbot.serverError'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    const initialMessages = [createWelcomeMessage(t)];

    setMessages(initialMessages);
    setInput('');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMessages));
    localStorage.removeItem(BACKEND_DISABLED_KEY);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-5 text-white sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/30">
                <Bot className="h-7 w-7 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight">
                    {t('chatbot.title')}
                  </h1>
                  <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                    {t('chatbot.live')}
                  </span>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-slate-300">
                  {t('chatbot.subtitle')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              {t('chatbot.clearChat')}
            </button>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="min-h-[520px] bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
            <div className="flex max-h-[520px] flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
              {messages.map((message, index) => {
                const isUser = message.role === 'user';

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex items-end gap-3 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isUser && (
                      <div className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-300/70">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[70%] ${
                        isUser
                          ? 'rounded-br-md bg-slate-900 text-white'
                          : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
                      }`}
                    >
                      {message.text}
                      {!isUser && message.mode && (
                        <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {message.mode === 'gemini'
                            ? t('chatbot.gemini')
                            : message.mode === 'local'
                              ? t('chatbot.local')
                              : t('chatbot.offline')}
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200/80">
                        <UserRound className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    {t('chatbot.thinking')}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
              className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t('chatbot.placeholder')}
                  className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
                <button
                  type="submit"
                  disabled={loading || input.trim().length === 0}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={t('chatbot.send')}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          <aside className="border-t border-slate-200 bg-white p-6 lg:border-l lg:border-t-0">
            <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t('chatbot.sidebarLabel')}
              </p>
              <h2 className="mt-2 text-lg font-bold text-slate-900">
                {t('chatbot.sidebarTitle')}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t('chatbot.sidebarDescription')}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t('chatbot.sidebarSuggestions')}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>{t('chatbot.prompts.stayLegzira')}</li>
                  <li>{t('chatbot.prompts.seafoodRestaurants')}</li>
                  <li>{t('chatbot.prompts.dayTripIdeas')}</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-4 text-slate-100">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                  {t('chatbot.sidebarFallbackTitle')}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {t('chatbot.sidebarFallbackDescription')}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
