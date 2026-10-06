// Sarthi AI Chat Service
import { GoogleGenAI } from '@google/genai';

export interface ChatAttachment {
  name: string;
  mimeType: string;
  data: string; // base64
}

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachment?: ChatAttachment;
}

export interface ChatContextPayload {
  college?: string;
  branch?: string;
  semester?: number;
  bandwidth?: string;
  attendance?: number;
}

export interface ChatRequestPayload {
  messages: ChatMessageItem[];
  attachment?: ChatAttachment;
  context?: ChatContextPayload;
}

/**
 * Cleanly format academic response text
 */
export function cleanAiResponseFormat(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#{4,6}\s+/gm, '### ')
    .replace(/\*{3,}/g, '**')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Resolve API URL using VITE_API_BASE_URL if provided in .env / deployment environment
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const envBase = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envBase && typeof envBase === 'string' && envBase.trim()) {
    const base = envBase.trim().replace(/\/+$/, '');
    return `${base}${cleanPath}`;
  }
  return cleanPath;
}

/**
 * Build system instruction and multi-turn contents array for Gemini
 */
function buildGeminiRequest(payload: ChatRequestPayload) {
  const { messages, attachment, context } = payload;
  const userMessage = (messages?.[messages.length - 1]?.content || '').trim();

  const systemInstruction = `You are Sarthi, an expert, empathetic, and exceptionally practical senior B.Tech mentor & academic copilot on PlanZo.
Student Academic Context:
- College / Institute: ${context?.college || 'B.Tech Engineering College'}
- Engineering Branch: ${context?.branch || 'Computer Science & Engineering'}
- Current Semester: Semester ${context?.semester || '1'}
- Current Schedule Load: ${context?.bandwidth || 'Balanced'}

Core Principles:
1. Provide direct, rigorous, and intelligent answers to whatever specific question the student asks—whether it is solving mathematics equations, explaining physics/chemistry concepts, writing and debugging code (C, C++, Python, Java, JS), breaking down syllabus topics, explaining engineering drawing principles, or advising on 75% attendance rules.
2. If an image or file is attached (e.g. photos of exam question papers, textbook pages, circuit diagrams, code screenshots, handwritten notes, or lab manuals), thoroughly analyze and explain it step-by-step.
3. Keep formatting clean, highly readable, and structured. Use clear section titles, clean numbered steps (1., 2., 3.), clean bullet points, and code blocks with syntax highlighting for code snippets. Avoid dumping messy raw symbols or excessive asterisks.
4. Never give robotic generic boilerplate, never repeat pre-fed canned answers, and never give a generic placeholder. Answer specifically and dynamically to the student's exact query.`;

  const contents: any[] = [];

  if (Array.isArray(messages) && messages.length > 1) {
    const history = messages.slice(-7, -1);
    for (const msg of history) {
      if (msg.content && typeof msg.content === 'string') {
        const role = msg.sender === 'user' ? 'user' : 'model';
        if (contents.length === 0 && role === 'model') {
          continue;
        }
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts.push({ text: msg.content });
        } else {
          contents.push({
            role,
            parts: [{ text: msg.content }],
          });
        }
      }
    }
  }

  const currentParts: any[] = [];
  if (userMessage) {
    currentParts.push({ text: userMessage });
  }

  if (attachment && attachment.data && attachment.mimeType) {
    const cleanBase64 = attachment.data.includes(',')
      ? attachment.data.split(',')[1]
      : attachment.data;
    currentParts.push({
      inlineData: {
        mimeType: attachment.mimeType,
        data: cleanBase64,
      },
    });
  }

  if (currentParts.length === 1 && currentParts[0].inlineData) {
    currentParts.unshift({
      text: 'Please carefully analyze this uploaded image/document, identify what it contains, explain the concepts, and solve or answer any problems shown.',
    });
  }

  if (currentParts.length === 0) {
    currentParts.push({ text: 'Hello, please help me with my B.Tech studies.' });
  }

  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts.push(...currentParts);
  } else {
    contents.push({
      role: 'user',
      parts: currentParts,
    });
  }

  return { systemInstruction, contents };
}

/**
 * Direct SDK invocation for deployed static environments where /api/chat is not hosted
 */
async function queryGeminiDirectSdk(payload: ChatRequestPayload): Promise<string | null> {
  const apiKey =
    (typeof process !== 'undefined' && (process as any).env?.GEMINI_API_KEY) ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    '';

  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const { systemInstruction, contents } = buildGeminiRequest(payload);
  const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
        },
      });
      if (response && response.text) {
        return cleanAiResponseFormat(response.text);
      }
    } catch (err) {
      console.warn(`Direct Gemini model ${model} attempt failed:`, err);
    }
  }

  return null;
}

/**
 * Primary Sarthi AI Query Handler
 * 1. First attempts Direct Gemini SDK if available (guarantees instant functionality after deployment on static hosts like Cloud Run Static / Vercel / Netlify).
 * 2. Also supports `/api/chat` backend endpoint when running via Express server.
 */
export async function querySarthiAi(payload: ChatRequestPayload): Promise<string> {
  // 1. Try Direct Gemini SDK first so deployed builds work 100% of the time without 404 on /api/chat
  try {
    const directReply = await queryGeminiDirectSdk(payload);
    if (directReply) {
      return directReply;
    }
  } catch (sdkErr) {
    console.warn('Direct SDK fallback to /api/chat:', sdkErr);
  }

  // 2. Fallback to backend /api/chat endpoint
  const configuredEndpoint = getApiUrl('/api/chat');
  const localEndpoint = '/api/chat';

  const endpointsToTry: string[] = [];
  if (configuredEndpoint !== localEndpoint) {
    endpointsToTry.push(configuredEndpoint);
  }
  endpointsToTry.push(localEndpoint);

  let lastErrorMessage = '';

  for (const endpoint of endpointsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify(payload),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            return cleanAiResponseFormat(data.reply);
          }
        }

        if (res.status === 404 || res.status === 405) {
          lastErrorMessage = `Endpoint ${endpoint} returned ${res.status}.`;
          break;
        }

        if (res.status === 503 || res.status === 429) {
          lastErrorMessage = 'AI server is experiencing high traffic. Please retry.';
          if (attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            continue;
          }
        } else {
          const errData = await res.json().catch(() => null);
          lastErrorMessage = errData?.error || `Server responded with status ${res.status}`;
        }
      } catch (netErr: any) {
        if (netErr?.name === 'AbortError') {
          lastErrorMessage = 'Request timed out. Please try asking again.';
        } else {
          lastErrorMessage = netErr?.message || 'Network connection failed.';
        }
        if (attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }

  throw new Error(
    lastErrorMessage || 'Sarthi AI is currently unreachable. Please check your network and retry.'
  );
}
