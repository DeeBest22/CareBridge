import { useState, useRef, useEffect, type FormEvent } from 'react';

type Role = 'patient' | 'provider';
type Msg = { from: 'user' | 'ai'; text: string };

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || 'gemini-flash-latest';

const SECTIONS: Record<Role, string> = {
  patient:
    'Overview (summary, health tips, quick record upload), Ask for care (send care requests to providers), Appointments, Medical Records (upload and view records), Prescriptions.',
  provider:
    'Overview (stats and activity), Inbox (patient care requests), Appointments, Patients (patient list and details).',
};

const SUGGESTIONS: Record<Role, string[]> = {
  patient: ['How do I ask for care?', 'How do I upload a record?', 'Where are my prescriptions?'],
  provider: ['How do I reply to a request?', 'Where are my appointments?', 'How do I find a patient?'],
};

const systemPrompt = (role: Role) =>
  `You are the in-app assistant for a healthcare web platform. The user is a ${role}. ` +
  `The ${role} dashboard has these sections: ${SECTIONS[role]} ` +
  `ONLY help with using this website and dashboard: navigation, features, and how-to steps. ` +
  `If asked anything else (medical advice, diagnoses, general knowledge, coding, etc.), politely decline in one sentence and redirect to what you can help with. ` +
  `Never invent features that are not listed. If unsure, say so. Keep answers short (max 3 sentences), friendly, plain text.`;

export default function AIAssistant({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy, open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { from: 'user', text: q }];
    setMsgs(next);
    setInput('');
    setBusy(true);
    let reply = 'Something went wrong. Please try again.';
    try {
      if (!API_KEY) throw new Error('missing key');
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt(role) }] },
            contents: next.slice(-12).map((m) => ({
              role: m.from === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }],
            })),
            generationConfig: { maxOutputTokens: 800, temperature: 0.4 },
          }),
        },
      );
      const data = await res.json();
      reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || reply;
    } catch (e) {
      if (!API_KEY) reply = 'Assistant is not configured yet. Add VITE_GEMINI_API_KEY to your .env file.';
    }
    setMsgs((m) => [...m, { from: 'ai', text: reply }]);
    setBusy(false);
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <div
        className={`w-[calc(100vw-2.5rem)] sm:w-[360px] origin-bottom-right overflow-hidden rounded-xl border border-border bg-card shadow-xl transition-all duration-200 ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Assistant</p>
            <p className="text-xs text-muted-foreground">Ask about the site &amp; dashboard</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="flex h-[340px] flex-col gap-2 overflow-y-auto px-4 py-3">
          {msgs.length === 0 && (
            <div className="my-auto space-y-2 text-center">
              <p className="text-sm text-muted-foreground">Hi! How can I help you today?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS[role].map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-border px-3 py-1 text-xs text-foreground hover:bg-muted">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                m.from === 'user' ? 'self-end bg-primary text-primary-foreground' : 'self-start bg-muted text-foreground'
              }`}
            >
              {m.text}
            </div>
          ))}
          {busy && (
            <div className="flex self-start gap-1 rounded-lg bg-muted px-3 py-3">
              {[0, 150, 300].map((d) => (
                <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a question…"
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity disabled:opacity-40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </form>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open assistant"
        className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          {open ? <path d="M6 9l6 6 6-6" /> : <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />}
        </svg>
      </button>
    </div>
  );
}
