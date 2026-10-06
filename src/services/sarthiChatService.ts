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

export interface SarthiDiagnosticLogEntry {
  timestamp: string;
  stage: 'env_resolution' | 'direct_sdk' | 'endpoint_attempt' | 'fallback_engine';
  endpoint?: string;
  status?: number | string;
  durationMs?: number;
  message: string;
  details?: Record<string, any>;
}

const DIAGNOSTIC_LOG_STORAGE_KEY = 'planzo_sarthi_connectivity_logs_v1';
const inMemoryDiagnosticLogs: SarthiDiagnosticLogEntry[] = [];

/**
 * Fallback logging mechanism to capture and inspect connectivity failures in production environments
 */
export function logSarthiConnectivityEvent(entry: Omit<SarthiDiagnosticLogEntry, 'timestamp'>): void {
  const fullEntry: SarthiDiagnosticLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  inMemoryDiagnosticLogs.push(fullEntry);
  if (inMemoryDiagnosticLogs.length > 50) {
    inMemoryDiagnosticLogs.shift();
  }

  // Output structured console diagnostic for browser DevTools Network/Console inspection
  const prefix = `[SarthiAI][${fullEntry.stage}]`;
  if (fullEntry.stage === 'endpoint_attempt' && fullEntry.status !== 200) {
    console.warn(prefix, fullEntry.message, fullEntry);
  } else if (fullEntry.stage === 'fallback_engine') {
    console.warn(prefix, fullEntry.message, fullEntry);
  } else {
    console.debug(prefix, fullEntry.message, fullEntry);
  }

  // Persist recent diagnostic logs safely in sessionStorage for post-mortem debugging
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(
        DIAGNOSTIC_LOG_STORAGE_KEY,
        JSON.stringify(inMemoryDiagnosticLogs.slice(-25))
      );
    }
  } catch {
    // Ignore storage quota or privacy-mode restrictions
  }
}

/**
 * Retrieve recorded connectivity diagnostic logs in production
 */
export function getSarthiDiagnosticLogs(): SarthiDiagnosticLogEntry[] {
  return [...inMemoryDiagnosticLogs];
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
 * Dynamic URL resolution strategy:
 * 1. Strictly prefers `import.meta.env.VITE_API_BASE_URL` (or `VITE_BACKEND_URL`) over hardcoded local strings.
 * 2. Supports runtime window override (`window.__PLANZO_API_BASE_URL__`) if injected by hosting platforms.
 * 3. Resolves relative to Vite's `BASE_URL` or `window.location.origin` dynamically without hardcoded localhost URLs.
 */
export function resolveDynamicApiUrl(endpointPath: string = '/api/chat'): string {
  const normalizedPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  const metaEnv = (import.meta as any).env || {};

  // 1. Prefer VITE_API_BASE_URL from environment variables
  const viteApiBase =
    metaEnv.VITE_API_BASE_URL ||
    metaEnv.VITE_BACKEND_URL ||
    (typeof process !== 'undefined' && (process as any).env?.VITE_API_BASE_URL) ||
    (typeof window !== 'undefined' && (window as any).__PLANZO_API_BASE_URL__) ||
    '';

  if (typeof viteApiBase === 'string' && viteApiBase.trim().length > 0) {
    const cleanBase = viteApiBase.trim().replace(/\/+$/, '');
    // Avoid duplicating /api if VITE_API_BASE_URL already ends with /api and normalizedPath starts with /api/
    if (cleanBase.endsWith('/api') && normalizedPath.startsWith('/api/')) {
      return `${cleanBase}${normalizedPath.slice(4)}`;
    }
    return `${cleanBase}${normalizedPath}`;
  }

  // 2. Respect Vite BASE_URL if deployed under a subpath
  const baseUrl = metaEnv.BASE_URL;
  if (typeof baseUrl === 'string' && baseUrl.trim() && baseUrl !== '/' && baseUrl !== './') {
    const cleanBaseUrl = baseUrl.trim().replace(/\/+$/, '');
    return `${cleanBaseUrl}${normalizedPath}`;
  }

  // 3. Use dynamic browser origin if available
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin.replace(/\/+$/, '')}${normalizedPath}`;
  }

  return normalizedPath;
}

// Keep getApiUrl as an alias for backwards compatibility across components
export const getApiUrl = resolveDynamicApiUrl;

/**
 * Build prioritized list of candidate API endpoints using dynamic URL resolution
 */
export function getCandidateApiEndpoints(endpointPath: string = '/api/chat'): string[] {
  const normalizedPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  const candidates: string[] = [];

  const addCandidate = (url: string | undefined | null) => {
    if (!url || typeof url !== 'string') return;
    const trimmed = url.trim();
    if (trimmed && !candidates.includes(trimmed)) {
      candidates.push(trimmed);
    }
  };

  // 1. Primary resolved URL (prefers VITE_API_BASE_URL)
  const primaryResolved = resolveDynamicApiUrl(normalizedPath);
  addCandidate(primaryResolved);

  // 2. Origin-qualified path in browser environments
  if (typeof window !== 'undefined' && window.location?.origin) {
    addCandidate(`${window.location.origin.replace(/\/+$/, '')}${normalizedPath}`);
  }

  // 3. Relative path fallback
  addCandidate(normalizedPath);

  logSarthiConnectivityEvent({
    stage: 'env_resolution',
    message: `Resolved ${candidates.length} candidate endpoint(s) for ${normalizedPath}`,
    details: {
      viteApiBaseUrlConfigured: Boolean((import.meta as any).env?.VITE_API_BASE_URL),
      primaryEndpoint: primaryResolved,
      candidates,
    },
  });

  return candidates;
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
  const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  for (const model of candidateModels) {
    const startMs = Date.now();
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
        },
      });
      if (response && response.text) {
        logSarthiConnectivityEvent({
          stage: 'direct_sdk',
          status: 200,
          durationMs: Date.now() - startMs,
          message: `Direct Gemini SDK succeeded with model ${model}`,
          details: { model },
        });
        return cleanAiResponseFormat(response.text);
      }
    } catch (err: any) {
      logSarthiConnectivityEvent({
        stage: 'direct_sdk',
        status: 'error',
        durationMs: Date.now() - startMs,
        message: `Direct Gemini model ${model} attempt failed: ${err?.message || 'Unknown error'}`,
        details: { model, error: err?.message || String(err) },
      });
    }
  }

  return null;
}

/**
 * Built-in B.Tech Academic Knowledge Engine fallback if both backend and network are unreachable
 */
function generateResilientAcademicFallback(payload: ChatRequestPayload): string {
  const { messages, attachment, context } = payload;
  const rawQuery = (messages?.[messages.length - 1]?.content || '').trim();
  const q = rawQuery.toLowerCase();
  const branch = context?.branch || 'B.Tech Engineering';
  const sem = context?.semester || 1;
  const att = context?.attendance !== undefined ? `${context.attendance}%` : '75%+ target';

  if (attachment && !rawQuery) {
    return `### 📄 Document / Image Analysis (${attachment.name})

1. **Key Observation**: I have received your uploaded file (**${attachment.name}**). For engineering problem sets, circuit diagrams, or code screenshots, always start by listing the given parameters and standard formulas.
2. **Step-by-Step Solution Approach**:
   - **Identify Given Data & Units**: Convert all quantities to standard SI units before substituting.
   - **Core Formula / Theorem**: State the governing equation or algorithm clearly (carries step-marking in university exams).
   - **Verification**: Check boundary conditions and dimensional consistency.
3. **Tip**: Tell me the specific question number or concept from this upload you want solved in detail!`;
  }

  if (q.includes('attendance') || q.includes('75%') || q.includes('bunk')) {
    return `### 🛡️ 75% Attendance Strategy (Current: ${att})

1. **University 75% Rule**: For every **4 lectures conducted**, you must attend at least **3 lectures** to stay at or above 75%.
2. **Safe Bunk Formula**:
   - **Safe Bunks Available** = \`floor((4 × Attended - 3 × Total) / 3)\`
   - **Classes Needed for 75%** = \`ceil(3 × Total - 4 × Attended)\`
3. **Actionable Advice**: Prioritise lab practicals (which carry direct internal assessment marks) and never miss consecutive lectures in high-credit core subjects.`;
  }

  if (
    q.includes('c program') ||
    q.includes('pointer') ||
    q.includes('array') ||
    q.includes('dsa') ||
    q.includes('code') ||
    q.includes('python') ||
    q.includes('java') ||
    q.includes('loop') ||
    q.includes('recursion')
  ) {
    return `### 💻 Programming & DSA Concept Breakdown

1. **Core Logic & Approach**:
   - Break the problem into **Input → Base Condition → Iterative/Recursive Step → Output**.
   - Track **Time Complexity** (aim for \`O(N)\` or \`O(N log N)\`) and **Space Complexity**.

\`\`\`c
#include <stdio.h>

// Standard Modular Template for B.Tech Lab & DSA
void solveProblem(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        // Process element with clear boundary check
        printf("%d ", arr[i]);
    }
    printf("\\n");
}

int main() {
    int data[] = {10, 20, 30, 40, 50};
    int size = sizeof(data) / sizeof(data[0]);
    solveProblem(data, size);
    return 0;
}
\`\`\`

2. **Exam & Viva Tip**: Always write dry-run trace tables and edge cases (\`n = 0\`, \`n = 1\`, \`NULL\` pointers) for full marks in university practicals.`;
  }

  if (
    q.includes('math') ||
    q.includes('matrix') ||
    q.includes('calculus') ||
    q.includes('differential') ||
    q.includes('integration') ||
    q.includes('eigen') ||
    q.includes('rank') ||
    q.includes('theorem')
  ) {
    return `### 📐 Engineering Mathematics Solution Framework

1. **Standard Method**:
   - **Matrices & Linear Algebra**: Use Elementary Row Operations (\`R_i → R_i - k·R_j\`) to reduce the matrix to **Row Echelon Form** for Rank, Consistency (\`Rank(A) = Rank([A|B])\`), and Eigenvalues (\`|A - λI| = 0\`).
   - **Calculus & Differential Equations**: Check whether the equation is Exact (\`∂M/∂y = ∂N/∂x\`) or Linear (\`dy/dx + Py = Q\`, Integrating Factor \`IF = e^(∫P dx)\`).
2. **High-Yield Exam Tip**: Write the standard theorem statement and formula in a box before substituting numerical values—university evaluators award 40% marks for method steps.`;
  }

  return `### 🎓 Sarthi Academic Guidance (${branch} · Sem ${sem})

Here is a structured breakdown for **"${rawQuery || 'your academic query'}"**:

1. **Core Concept & Definition**:
   - Start with the fundamental principle, governing equation, or block diagram associated with **${rawQuery || 'this topic'}**.
   - Highlight the key parameters, assumptions, and standard units used in university syllabus derivations.
2. **Step-by-Step Application**:
   - **Step 1 (Theory/Model)**: Define the system state, input variables, and constraints.
   - **Step 2 (Derivation/Implementation)**: Apply the core theorem or algorithm systematically.
   - **Step 3 (Result & Verification)**: Validate the output against boundary conditions or standard test cases.
3. **1-Hour Study Sprint Recommendation**:
   - **00–20 min**: Review core definitions & standard derivations.
   - **20–45 min**: Solve 2–3 previous year university questions (PYQs).
   - **45–60 min**: Summarize key formulas into your revision sheet.`;
}

/**
 * Primary Sarthi AI Query Handler
 * 1. Attempts Direct Gemini SDK if available (works immediately in static production builds).
 * 2. Attempts environment-aware `/api/chat` backend endpoints (`VITE_API_BASE_URL`, relative path, origin path).
 * 3. Gracefully falls back to the built-in Academic Knowledge Engine if the user is offline or backend is unreachable.
 */
export async function querySarthiAi(payload: ChatRequestPayload): Promise<string> {
  // 1. Try environment-resolved API endpoints first if VITE_API_BASE_URL is explicitly configured
  const hasExplicitEnvBase = Boolean(
    (import.meta as any).env?.VITE_API_BASE_URL || (import.meta as any).env?.VITE_BACKEND_URL
  );
  const endpointsToTry = getCandidateApiEndpoints('/api/chat');

  const tryEndpoints = async (): Promise<string | null> => {
    for (const endpoint of endpointsToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        const startMs = Date.now();
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 25000);

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
          const durationMs = Date.now() - startMs;
          const contentType = res.headers.get('content-type') || '';

          if (res.ok && contentType.includes('application/json')) {
            const data = await res.json();
            if (data && data.reply) {
              logSarthiConnectivityEvent({
                stage: 'endpoint_attempt',
                endpoint,
                status: res.status,
                durationMs,
                message: `Successfully received AI response from ${endpoint} (attempt ${attempt})`,
              });
              return cleanAiResponseFormat(data.reply);
            }
          }

          logSarthiConnectivityEvent({
            stage: 'endpoint_attempt',
            endpoint,
            status: res.status,
            durationMs,
            message: `Endpoint ${endpoint} returned status ${res.status} (content-type: ${contentType || 'none'}, attempt ${attempt})`,
            details: { attempt, contentType },
          });

          // If endpoint returns 404, 405, or HTML fallback page on static hosting, move to next candidate immediately
          if (res.status === 404 || res.status === 405 || !contentType.includes('application/json')) {
            break;
          }

          if ((res.status === 503 || res.status === 429) && attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            continue;
          }
        } catch (netErr: any) {
          const durationMs = Date.now() - startMs;
          logSarthiConnectivityEvent({
            stage: 'endpoint_attempt',
            endpoint,
            status: netErr?.name === 'AbortError' ? 'timeout' : 'network_error',
            durationMs,
            message: `Network request to ${endpoint} failed (attempt ${attempt}): ${netErr?.message || 'Connection error'}`,
            details: { attempt, errorName: netErr?.name, errorMessage: netErr?.message },
          });

          if (attempt === 1 && netErr?.name !== 'AbortError') {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }
        }
      }
    }
    return null;
  };

  // If VITE_API_BASE_URL is explicitly configured, prefer the configured API endpoint first
  if (hasExplicitEnvBase) {
    const apiReply = await tryEndpoints();
    if (apiReply) return apiReply;
  }

  // 2. Try Direct Gemini SDK (for static production deployments where /api/chat is not hosted)
  try {
    const directReply = await queryGeminiDirectSdk(payload);
    if (directReply) {
      return directReply;
    }
  } catch (sdkErr: any) {
    logSarthiConnectivityEvent({
      stage: 'direct_sdk',
      status: 'exception',
      message: `Direct SDK invocation threw exception: ${sdkErr?.message || String(sdkErr)}`,
    });
  }

  // 3. Try candidate API endpoints if not already tried
  if (!hasExplicitEnvBase) {
    const apiReply = await tryEndpoints();
    if (apiReply) return apiReply;
  }

  // 4. Graceful fallback with diagnostic log so production debugging is transparent
  logSarthiConnectivityEvent({
    stage: 'fallback_engine',
    status: 'fallback_activated',
    message: 'All remote endpoints and SDK attempts failed; serving response from local B.Tech Academic Fallback Engine.',
    details: {
      triedEndpoints: endpointsToTry,
      origin: typeof window !== 'undefined' ? window.location?.origin : 'unknown',
    },
  });

  return generateResilientAcademicFallback(payload);
}

