import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ============================================================================
// PLANZO PERSISTENT DATABASE & AUTHENTICATION ENGINE (Strict User Isolation)
// ============================================================================
interface DbUser {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  created_at: string;
  college?: string;
  branch?: string;
  semester?: number;
  avatar_url?: string;
}

interface DbSession {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
}

interface DbTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  completed: boolean;
  due_date: string;
  start_time: string;
  end_time: string;
  project_id?: string;
  created_at: string;
}

interface DbProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed';
  progress: number;
  due_date: string;
  color: string;
  created_at: string;
}

interface DbCalendarEvent {
  id: string;
  user_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'deadline' | 'meeting' | 'study' | 'milestone';
  notes?: string;
  created_at: string;
}

interface PlanzoDatabaseSchema {
  users: DbUser[];
  sessions: DbSession[];
  tasks: DbTask[];
  projects: DbProject[];
  calendar_events: DbCalendarEvent[];
  user_workspaces: Record<string, any>;
}

const DB_FILE_PATH = path.resolve(__dirname, '.planzo_db.json');

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(`planzo_salt_${password}`).digest('hex');
}

function loadDatabase(): PlanzoDatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        calendar_events: Array.isArray(parsed.calendar_events) ? parsed.calendar_events : [],
        user_workspaces: parsed.user_workspaces && typeof parsed.user_workspaces === 'object' ? parsed.user_workspaces : {},
      };
    }
  } catch (err) {
    console.warn('Database load warning, initializing clean store:', err);
  }
  return {
    users: [],
    sessions: [],
    tasks: [],
    projects: [],
    calendar_events: [],
    user_workspaces: {},
  };
}

function saveDatabase(db: PlanzoDatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Database write error:', err);
  }
}

function getAuthenticatedUser(req: express.Request): { db: PlanzoDatabaseSchema; user: DbUser | null; token: string | null } {
  const db = loadDatabase();
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token) return { db, user: null, token: null };

  const session = db.sessions.find((s) => s.token === token);
  if (!session) return { db, user: null, token };

  const user = db.users.find((u) => u.id === session.user_id) || null;
  return { db, user, token };
}

function seedStarterWorkspaceForUser(db: PlanzoDatabaseSchema, user: DbUser): void {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

  const existingProjects = db.projects.filter((p) => p.user_id === user.id);
  let defaultProjectId = existingProjects[0]?.id;

  if (existingProjects.length === 0) {
    defaultProjectId = `proj-${user.id.slice(-6)}-1`;
    const starterProjects: DbProject[] = [
      {
        id: defaultProjectId,
        user_id: user.id,
        name: 'Semester Core & Academic Excellence',
        description: 'Structured study blocks, syllabus completion, and lab readiness.',
        status: 'active',
        progress: 65,
        due_date: nextWeek,
        color: '#6C4DFF',
        created_at: new Date().toISOString(),
      },
      {
        id: `proj-${user.id.slice(-6)}-2`,
        user_id: user.id,
        name: 'Full-Stack Capstone & Portfolio',
        description: 'Building production-ready engineering projects and DSA practice.',
        status: 'active',
        progress: 40,
        due_date: nextWeek,
        color: '#3B9CFF',
        created_at: new Date().toISOString(),
      },
    ];
    db.projects.push(...starterProjects);
  }

  const existingEvents = db.calendar_events.filter((e) => e.user_id === user.id);
  if (existingEvents.length === 0) {
    const starterEvents: DbCalendarEvent[] = [
      {
        id: `evt-${user.id.slice(-6)}-1`,
        user_id: user.id,
        title: 'Algorithm Design & Problem Solving Sprint',
        date: today,
        start_time: '09:00',
        end_time: '10:00',
        type: 'study',
        notes: 'Focus on dynamic programming and graph traversal.',
        created_at: new Date().toISOString(),
      },
      {
        id: `evt-${user.id.slice(-6)}-2`,
        user_id: user.id,
        title: 'Project Milestone Review & Submission',
        date: tomorrow,
        start_time: '14:00',
        end_time: '15:00',
        type: 'deadline',
        notes: 'Prepare demo walkthrough and architecture slides.',
        created_at: new Date().toISOString(),
      },
    ];
    db.calendar_events.push(...starterEvents);
  }
}

// 1. POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
  try {
    const { fullName, email, password, college, branch, semester } = req.body;
    const cleanName = String(fullName || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const rawPass = String(password || '');

    if (!cleanName || !cleanEmail || !rawPass) {
      return res.status(400).json({ error: 'All fields (Full Name, Email, and Password) are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (rawPass.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const db = loadDatabase();
    const duplicate = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (duplicate) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in instead.' });
    }

    const userId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const nowIso = new Date().toISOString();

    const newUser: DbUser = {
      id: userId,
      full_name: cleanName,
      email: cleanEmail,
      password_hash: hashPassword(rawPass),
      created_at: nowIso,
      college: college || 'Samrat Ashok Technological Institute (SATI), Vidisha M.P.',
      branch: branch || 'B.Tech. Computer Science & Engineering',
      semester: Number(semester) || 1,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}&colors=emerald,cyan,teal`,
    };

    db.users.push(newUser);
    seedStarterWorkspaceForUser(db, newUser);

    const token = `pz_sess_${crypto.randomBytes(24).toString('hex')}`;
    db.sessions.push({
      token,
      user_id: newUser.id,
      created_at: nowIso,
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    saveDatabase(db);

    return res.status(201).json({
      message: 'Account created successfully. Welcome to Planzo!',
      token,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        created_at: newUser.created_at,
        college: newUser.college,
        branch: newUser.branch,
        semester: newUser.semester,
        avatar_url: newUser.avatar_url,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Server error while creating account.' });
  }
});

// 2. POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();
    const rawPass = String(password || '');

    if (!cleanEmail || !rawPass) {
      return res.status(400).json({ error: 'Please enter both your email and password.' });
    }

    const db = loadDatabase();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.full_name.toLowerCase() === cleanEmail
    );

    if (!user) {
      return res.status(401).json({ error: 'No account found with that email address. Please sign up first.' });
    }

    const hashedInput = hashPassword(rawPass);
    if (user.password_hash !== hashedInput) {
      return res.status(401).json({ error: 'Incorrect email or password. Please try again.' });
    }

    seedStarterWorkspaceForUser(db, user);

    const nowIso = new Date().toISOString();
    const token = `pz_sess_${crypto.randomBytes(24).toString('hex')}`;
    db.sessions.push({
      token,
      user_id: user.id,
      created_at: nowIso,
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    saveDatabase(db);

    return res.json({
      message: `Welcome back, ${user.full_name}!`,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// 3. POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  try {
    const { db, token } = getAuthenticatedUser(req);
    if (token) {
      db.sessions = db.sessions.filter((s) => s.token !== token);
      saveDatabase(db);
    }
    return res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to logout.' });
  }
});

// 4. GET /api/auth/me (Verify Session)
app.get('/api/auth/me', (req, res) => {
  const { user } = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
  return res.json({
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at,
      college: user.college,
      branch: user.branch,
      semester: user.semester,
      avatar_url: user.avatar_url,
    },
  });
});

// 5. POST /api/auth/forgot-password (Verify email exists & reset password)
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({ error: 'Please enter your registered email address.' });
    }

    const db = loadDatabase();
    const userIndex = db.users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'No account found with that email address.' });
    }

    // If newPassword is provided, update the user's password immediately
    if (newPassword !== undefined) {
      const rawNew = String(newPassword);
      if (rawNew.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      }
      db.users[userIndex].password_hash = hashPassword(rawNew);
      saveDatabase(db);
      return res.json({
        step: 'reset_complete',
        message: 'Your password has been reset successfully! You can now log in with your new password.',
      });
    }

    return res.json({
      step: 'email_verified',
      message: 'Account verified! Enter your new password below to complete the reset.',
      email: cleanEmail,
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to process password reset request.' });
  }
});

// 6. GET /api/workspace (Fetch strictly isolated user data: tasks, projects, calendar_events, and workspace state)
app.get('/api/workspace', (req, res) => {
  const { db, user } = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const userTasks = db.tasks.filter((t) => t.user_id === user.id);
  const userProjects = db.projects.filter((p) => p.user_id === user.id);
  const userEvents = db.calendar_events.filter((e) => e.user_id === user.id);
  const workspaceSnapshot = db.user_workspaces[user.id] || null;

  return res.json({
    tasks: userTasks,
    projects: userProjects,
    events: userEvents,
    workspace: workspaceSnapshot,
  });
});

// 7. POST /api/workspace/sync (Persist user-isolated workspace state & entities)
app.post('/api/workspace/sync', (req, res) => {
  const { db, user } = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const { workspace, tasks, projects, events } = req.body;

  if (workspace && typeof workspace === 'object') {
    db.user_workspaces[user.id] = {
      ...(db.user_workspaces[user.id] || {}),
      ...workspace,
      updated_at: new Date().toISOString(),
    };
  }

  if (Array.isArray(tasks)) {
    const otherUsersTasks = db.tasks.filter((t) => t.user_id !== user.id);
    const sanitizedUserTasks: DbTask[] = tasks.map((t: any) => ({
      id: String(t.id || `task_${Date.now()}`),
      user_id: user.id,
      title: String(t.title || 'Untitled Task'),
      description: t.description || t.notes || '',
      category: String(t.category || 'study'),
      priority: t.priority || (t.cognitiveWeight >= 4 ? 'high' : t.cognitiveWeight === 3 ? 'medium' : 'low'),
      status: t.completed ? 'completed' : 'todo',
      completed: Boolean(t.completed),
      due_date: String(t.date || t.due_date || new Date().toISOString().split('T')[0]),
      start_time: String(t.startTime || t.start_time || '09:00'),
      end_time: String(t.endTime || t.end_time || '10:00'),
      project_id: t.project_id || undefined,
      created_at: t.created_at || new Date().toISOString(),
    }));
    db.tasks = [...otherUsersTasks, ...sanitizedUserTasks];
  }

  if (Array.isArray(projects)) {
    const otherUsersProjects = db.projects.filter((p) => p.user_id !== user.id);
    const sanitizedProjects: DbProject[] = projects.map((p: any) => ({
      id: String(p.id || `proj_${Date.now()}`),
      user_id: user.id,
      name: String(p.name || 'Untitled Project'),
      description: String(p.description || ''),
      status: p.status || 'active',
      progress: Number(p.progress ?? 0),
      due_date: String(p.due_date || new Date().toISOString().split('T')[0]),
      color: String(p.color || '#6C4DFF'),
      created_at: p.created_at || new Date().toISOString(),
    }));
    db.projects = [...otherUsersProjects, ...sanitizedProjects];
  }

  if (Array.isArray(events)) {
    const otherUsersEvents = db.calendar_events.filter((e) => e.user_id !== user.id);
    const sanitizedEvents: DbCalendarEvent[] = events.map((e: any) => ({
      id: String(e.id || `evt_${Date.now()}`),
      user_id: user.id,
      title: String(e.title || 'Untitled Event'),
      date: String(e.date || new Date().toISOString().split('T')[0]),
      start_time: String(e.start_time || e.startTime || '10:00'),
      end_time: String(e.end_time || e.endTime || '11:00'),
      type: e.type || 'study',
      notes: e.notes || '',
      created_at: e.created_at || new Date().toISOString(),
    }));
    db.calendar_events = [...otherUsersEvents, ...sanitizedEvents];
  }

  saveDatabase(db);
  return res.json({ status: 'synced', userId: user.id });
});


// Health / Status check for Sarthi AI
app.get('/api/chat', (_req, res) => {
  res.json({ status: 'ok', service: 'Sarthi AI Copilot Server', timestamp: Date.now() });
});

// Initialize GoogleGenAI server-side with required telemetry User-Agent
function getAiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint: Student Life AI Chatbot (PlanZo Coach / Sarthi AI)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, attachment, context } = req.body;
    const userMessage = (messages?.[messages.length - 1]?.content || '').trim();

    if (!userMessage && !attachment?.data) {
      return res.status(400).json({ error: 'Message or attachment is required' });
    }

    const ai = getAiClient();

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

    if (ai) {
      // Build conversation contents for Gemini ensuring valid multiturn format
      const contents: any[] = [];

      // Include previous turns for context (up to last 6 messages)
      if (Array.isArray(messages) && messages.length > 1) {
        const history = messages.slice(-7, -1);
        for (const msg of history) {
          if (msg.content && typeof msg.content === 'string') {
            const role = msg.sender === 'user' ? 'user' : 'model';
            // Gemini strictly requires conversation contents to start with 'user'
            if (contents.length === 0 && role === 'model') {
              continue; // Skip initial welcome or assistant greetings
            }
            // Gemini strictly requires alternating roles: user -> model -> user -> model
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

      // Build the latest turn
      const currentParts: any[] = [];
      if (userMessage) {
        currentParts.push({ text: userMessage });
      }

      // Include image / document attachment if provided
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

      // Fallback text if user only uploaded an attachment
      if (currentParts.length === 1 && currentParts[0].inlineData) {
        currentParts.unshift({
          text: 'Please carefully analyze this uploaded image/document, identify what it contains, explain the concepts, and solve or answer any problems shown.',
        });
      }

      if (currentParts.length === 0) {
        currentParts.push({ text: 'Hello, please help me with my B.Tech studies.' });
      }

      // Append final turn as 'user'
      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents[contents.length - 1].parts.push(...currentParts);
      } else {
        contents.push({
          role: 'user',
          parts: currentParts,
        });
      }

      // Try modern models with gemini-3.8-flash first for fast and reliable responses
      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let generatedText = '';
      let lastError: any = null;

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
            generatedText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${model} attempt error:`, err?.message?.slice(0, 150) || err);
          lastError = err;
        }
      }

      if (generatedText) {
        return res.json({ reply: generatedText });
      }

      console.error('All Gemini candidate models failed:', lastError);
      return res.status(503).json({
        error: 'AI service is temporarily busy. Please retry in a few seconds.',
      });
    }

    return res.status(500).json({ error: 'Gemini API is not configured on this server.' });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat response' });
  }
});

// Endpoint: Dynamic Schedule Recalibration
app.post('/api/recalibrate', async (req, res) => {
  try {
    const { items, missedItemTitle, reason } = req.body;
    const ai = getAiClient();

    if (ai) {
      const prompt = `You are a dynamic scheduler for an engineering student.
The student missed or wants to shift this task: "${missedItemTitle}" (Reason: ${reason || 'Fatigue / schedule clash'}).
Current remaining daily tasks: ${JSON.stringify(items)}

Task: Suggest how to quietly rearrange their schedule without guilt.
Return ONLY valid JSON matching this schema:
{
  "summary": "Short 1-sentence reassuring summary of the adjustment",
  "bufferAddedMinutes": 20,
  "suggestedAction": "Shifted to tomorrow morning and inserted a 20-min Chill Block"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    return res.json({
      summary: `Schedule quietly adjusted. "${missedItemTitle || 'Missed task'}" shifted to a lighter time slot.`,
      bufferAddedMinutes: 20,
      suggestedAction: 'Inserted a restorative buffer zone and preserved your evening wind-down.',
    });
  } catch (error) {
    console.error('Recalibrate error:', error);
    res.json({
      summary: 'Schedule quietly adjusted. Buffer zone added.',
      bufferAddedMinutes: 20,
      suggestedAction: 'Postponed task to tomorrow morning.',
    });
  }
});

// Endpoint: Academic Syllabus Deep Dive & Study Chunk Planner
app.post('/api/syllabus-planner', async (req, res) => {
  try {
    const { subject, daysRemaining, currentLevel } = req.body;
    const ai = getAiClient();

    if (ai) {
      const prompt = `For the engineering subject "${subject}", generate an accelerated study roadmap for a student with ${daysRemaining || 7} days remaining who is currently at "${currentLevel || 'Beginner'}" level.
Return JSON with:
{
  "studyPlan": [
    { "phase": "string", "focusTopics": ["string"], "recommendedVideo": "string", "estimatedHours": 2 }
  ],
  "highYieldTip": "string"
}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    return res.json({
      studyPlan: [
        {
          phase: 'Phase 1: Core Definitions & High-Yield Units',
          focusTopics: ['Module 1 Foundational Concepts', 'Standard Derivations & Diagrams'],
          recommendedVideo: `Neso Academy & Gate Smashers - ${subject} Playlist`,
          estimatedHours: 2,
        },
        {
          phase: 'Phase 2: Numerical Problems & Previous Year Questions',
          focusTopics: ['University PYQs (2022-2025)', 'Solved Examples from Standard Text'],
          recommendedVideo: `Abdul Bari / 3Blue1Brown - Intuitive Problem Solving`,
          estimatedHours: 2.5,
        },
        {
          phase: 'Phase 3: Formula Sheet & Mock Paper Review',
          focusTopics: ['Summary Cheat Sheet', '1 Timed Exam Paper Simulation'],
          recommendedVideo: `High-Yield Quick Revision Lecture`,
          estimatedHours: 1.5,
        },
      ],
      highYieldTip: `Focus on the 3 questions that appear consistently in the last 5 semester papers.`,
    });
  } catch (error) {
    console.error('Syllabus planner error:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

// Vite Middleware integration for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PlanZo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
