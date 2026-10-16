import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type RuntimeEnv = Record<string, string | undefined>;

function envValue(env: unknown, key: string) {
  return (env as RuntimeEnv)?.[key] ?? process.env[key];
}

async function handleCareApi(request: Request, env: unknown): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (path === '/api/bmoni/subscribe' && request.method === 'POST') {
    const apiKey = envValue(env, 'BMONI_API_KEY');
    const recipientId = envValue(env, 'BMONI_CARELINK_RECIPIENT_USER_ID');
    if (!apiKey || !recipientId) return Response.json({ error: 'BMONI billing is not configured yet.' }, { status: 503 });
    const body = await request.json().catch(() => null) as { userId?: unknown; walletId?: unknown } | null;
    const userId = typeof body?.userId === 'string' ? body.userId : '';
    const walletId = typeof body?.walletId === 'string' ? body.walletId : '';
    if (!userId || !walletId) return Response.json({ error: 'Enter your BMONI user and smart-wallet IDs.' }, { status: 400 });
    const base = (envValue(env, 'BMONI_BASE_URL') ?? 'https://embedded-dev.bmoni.com').replace(/\/$/, '');
    const payment = await fetch(`${base}/v1/users/${encodeURIComponent(userId)}/smart-wallets/${encodeURIComponent(walletId)}/proposals`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': apiKey }, body: JSON.stringify({ proposal: { type: 'TRANSFER', toUserId: recipientId, amount: envValue(env, 'CARELINK_PLAN_AMOUNT') ?? '5000.00', currency: envValue(env, 'CARELINK_PLAN_CURRENCY') ?? 'CNGN', description: 'CareLink monthly care subscription' } }) });
    const result = await payment.json().catch(() => null) as { data?: { proposal?: { id?: string } } } | null;
    if (!payment.ok || !result?.data?.proposal?.id) return Response.json({ error: 'BMONI could not create the payment proposal.' }, { status: 502 });
    return Response.json({ proposalId: result.data.proposal.id, message: 'Payment proposal created. Approve and sign it in your BMONI wallet to complete payment.' });
  }
  if (path === '/api/carelink-assistant' && request.method === 'POST') {
    const apiKey = envValue(env, 'GEMMA_API_KEY') ?? envValue(env, 'GEMINI_API_KEY');
    if (!apiKey) return Response.json({ error: 'The CareLink assistant is not configured yet.' }, { status: 503 });

    const body = await request.json().catch(() => null) as { question?: unknown } | null;
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    if (question.length < 3 || question.length > 1000) {
      return Response.json({ error: 'Please enter a question between 3 and 1000 characters.' }, { status: 400 });
    }

    const prompt = `You are CareLink, a careful health-navigation assistant for a healthcare platform in Africa. Answer the user's general health question in plain language using brief paragraphs or bullets. Do not diagnose, prescribe, interpret a personal medical record, or invent facts. Encourage the user to speak with a qualified clinician for personal advice. If the question suggests an emergency such as chest pain, severe breathing trouble, stroke signs, severe bleeding, or thoughts of self-harm, tell them to contact local emergency services immediately. User question: ${question}`;
    const model = envValue(env, 'GEMMA_MODEL') ?? 'gemma-4-26b-a4b-it';
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3 } }),
    });
    if (!upstream.ok) {
      const failure = await upstream.json().catch(() => null) as { error?: { message?: unknown } } | null;
      console.error('CareLink assistant upstream request failed', {
        status: upstream.status,
        message: typeof failure?.error?.message === 'string' ? failure.error.message : undefined,
      });
      const error = upstream.status === 401 || upstream.status === 403
        ? 'Gemini rejected the API key. Check GEMINI_API_KEY in your server environment.'
        : upstream.status === 404
          ? 'The configured Gemma model was not found. Check GEMMA_MODEL.'
          : upstream.status === 429
            ? 'Gemini is rate-limiting requests. Please try again shortly.'
            : 'The CareLink assistant could not process this request. Please try again.';
      return Response.json({ error }, { status: 502 });
    }

    const result = await upstream.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const answer = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() ?? '';
    return answer ? Response.json({ answer }) : Response.json({ error: 'The CareLink assistant returned an empty response.' }, { status: 502 });
  }
  if (path === '/api/site-assistant' && request.method === 'POST') {
    const apiKey = envValue(env, 'GEMMA_API_KEY') ?? envValue(env, 'GEMINI_API_KEY');
    if (!apiKey) return Response.json({ error: 'The assistant is not configured yet.' }, { status: 503 });

    const body = await request.json().catch(() => null) as { question?: unknown; role?: unknown } | null;
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    const role = body?.role === 'provider' ? 'provider' : 'patient';
    if (question.length < 1 || question.length > 1000) return Response.json({ error: 'Please enter a question between 1 and 1000 characters.' }, { status: 400 });

    const sections = role === 'provider'
      ? 'Overview, Inbox for patient care requests, Appointments, and Patients for patient lists and details.'
      : 'Overview, Appointments, Medical Records for uploads and viewing records, and Prescriptions.';
    const prompt = `You are the in-app assistant for CareBridge, a healthcare web platform. The user is a ${role}. Their dashboard includes: ${sections} Only answer questions about navigating or using this website. Do not provide medical advice, diagnoses, or general knowledge. Do not invent features. Keep the answer to 3 short sentences maximum in plain text. User question: ${question}`;
    const model = envValue(env, 'GEMMA_MODEL') ?? 'gemma-4-26b-a4b-it';
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 300 } }),
    });
    if (!upstream.ok) return Response.json({ error: 'The assistant could not process this request.' }, { status: 502 });
    const result = await upstream.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> } }> };
    const answer = result.candidates?.[0]?.content?.parts?.filter((part) => !part.thought).map((part) => part.text ?? '').join('').trim() ?? '';
    return answer ? Response.json({ answer }) : Response.json({ error: 'The assistant returned an empty response.' }, { status: 502 });
  }
  if (path === '/api/clinical-copilot' && request.method === 'POST') {
    const apiKey = envValue(env, 'GEMMA_API_KEY') ?? envValue(env, 'GEMINI_API_KEY');
    if (!apiKey) return Response.json({ error: 'The clinical copilot is not configured yet.' }, { status: 503 });

    const body = await request.json().catch(() => null) as {
      patient?: { name?: unknown; age?: unknown; gender?: unknown; condition?: unknown; status?: unknown };
      records?: unknown;
    } | null;
    const patient = body?.patient;
    const records = Array.isArray(body?.records) ? body.records.slice(0, 30) : [];
    if (!patient || records.length === 0) {
      return Response.json({ error: 'Select a patient with at least one shared record.' }, { status: 400 });
    }

    const prompt = `You are a clinical documentation assistant supporting a licensed healthcare provider. Use only the supplied patient context and shared record summaries. Do not diagnose, prescribe, or invent missing facts. Return JSON only with: overview (2-3 sentence neutral summary), observations (up to 4 concise record-grounded observations), followUpQuestions (up to 4 questions for the next visit), and safetyNote (one sentence reminding the provider to verify against the full chart).\nPatient: ${JSON.stringify(patient)}\nShared records: ${JSON.stringify(records)}`;
    const model = envValue(env, 'GEMMA_MODEL') ?? 'gemma-4-26b-a4b-it';
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    });
    if (!upstream.ok) return Response.json({ error: 'The clinical copilot could not process this request.' }, { status: 502 });

    const result = await upstream.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
    try {
      const parsed = JSON.parse(text) as { overview?: unknown; observations?: unknown; followUpQuestions?: unknown; safetyNote?: unknown };
      return Response.json({
        overview: typeof parsed.overview === 'string' ? parsed.overview : '',
        observations: Array.isArray(parsed.observations) ? parsed.observations.filter((item): item is string => typeof item === 'string').slice(0, 4) : [],
        followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions.filter((item): item is string => typeof item === 'string').slice(0, 4) : [],
        safetyNote: typeof parsed.safetyNote === 'string' ? parsed.safetyNote : 'Verify this summary against the full chart before making care decisions.',
      });
    } catch {
      return Response.json({ error: 'The clinical copilot returned an invalid response.' }, { status: 502 });
    }
  }
  if (path !== '/api/triage') return null;
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const apiKey = envValue(env, 'OPENAI_API_KEY');
  if (!apiKey) return Response.json({ error: 'The care assistant is not configured yet.' }, { status: 503 });
  const body = await request.json().catch(() => null) as { complaint?: unknown; answers?: unknown } | null;
  const complaint = typeof body?.complaint === 'string' ? body.complaint.trim() : '';
  if (complaint.length < 10 || complaint.length > 4000) return Response.json({ error: 'Please provide a valid concern.' }, { status: 400 });
  const answers = body?.answers && typeof body.answers === 'object' ? body.answers : {};
  const input = `You are a careful healthcare intake assistant. You do not diagnose, prescribe, or reassure away emergencies. Return JSON only with summary (neutral clinician context), urgency (routine, priority, or urgent), and questions (0-4 concise follow-up questions).\nConcern: ${complaint}\nAnswers: ${JSON.stringify(answers)}`;
  const upstream = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' }, body: JSON.stringify({ model: envValue(env, 'OPENAI_MODEL') ?? 'gpt-5-mini', input, text: { format: { type: 'json_object' } } }) });
  if (!upstream.ok) return Response.json({ error: 'The care assistant could not process this request.' }, { status: 502 });
  const result = await upstream.json() as { output_text?: string };
  try {
    const parsed = JSON.parse(result.output_text ?? '{}') as { summary?: unknown; urgency?: unknown; questions?: unknown };
    return Response.json({ summary: typeof parsed.summary === 'string' ? parsed.summary : '', urgency: ['routine', 'priority', 'urgent'].includes(String(parsed.urgency)) ? parsed.urgency : 'routine', questions: Array.isArray(parsed.questions) ? parsed.questions.filter((q): q is string => typeof q === 'string').slice(0, 4) : [] });
  } catch { return Response.json({ error: 'The care assistant returned an invalid response.' }, { status: 502 }); }
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const careApiResponse = await handleCareApi(request, env);
      if (careApiResponse) return careApiResponse;
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
