import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',').map(v => v.trim()) || true }));
app.use(express.json({ limit: '2mb' }));

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } }) : null;

function requireSupabase(req, res, next) {
  if (!supabase) return res.status(503).json({ error: 'Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' });
  next();
}

async function requireAdmin(req, res, next) {
  if (!supabase) return res.status(503).json({ error: 'Supabase is not configured.' });
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing access token.' });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) return res.status(401).json({ error: 'Invalid or expired session.' });
  const { data: profile, error: profileError } = await supabase.from('admin_profiles').select('id, role, active').eq('id', userData.user.id).maybeSingle();
  if (profileError || !profile?.active) return res.status(403).json({ error: 'Admin access is not enabled for this user.' });
  req.user = userData.user;
  req.admin = profile;
  next();
}

app.get('/api/health', (_req, res) => res.json({ ok: true, supabaseConfigured: Boolean(supabase) }));

app.get('/api/public/content', async (_req, res) => {
  if (!supabase) return res.json({ projects: [], services: [], settings: {}, databaseConfigured: false });
  const [projects, services, settings] = await Promise.all([
    supabase.from('projects').select('*').eq('published', true).order('sort_order', { ascending: true }),
    supabase.from('services').select('*').eq('published', true).order('sort_order', { ascending: true }),
    supabase.from('site_settings').select('key,value').limit(100)
  ]);
  res.json({ projects: projects.data || [], services: services.data || [], settings: Object.fromEntries((settings.data || []).map(x => [x.key, x.value])), databaseConfigured: true });
});

app.get('/api/public/reviews', requireSupabase, async (_req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id,name,role,rating,text,created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ reviews: data || [] });
});

app.post('/api/public/reviews', requireSupabase, async (req, res) => {
  const { name, role, rating, text } = req.body || {};
  const numericRating = Number(rating);
  if (!name?.trim() || !text?.trim()) return res.status(400).json({ error: 'Name and review are required.' });
  if (!Number.isInteger(numericRating) || numericRating < 0 || numericRating > 5) return res.status(400).json({ error: 'Rating must be between 0 and 5.' });
  if (String(name).trim().length > 80 || String(text).trim().length > 1200) return res.status(400).json({ error: 'Review is too long.' });
  const { data, error } = await supabase
    .from('reviews')
    .insert({ name: String(name).trim(), role: role ? String(role).trim() : null, rating: numericRating, text: String(text).trim(), published: true })
    .select('id,name,role,rating,text,created_at')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Review published.', data });
});

app.post('/api/public/contact', requireSupabase, async (req, res) => {
  const { name, email, phone, company, message, source = 'website' } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required.' });
  const { data, error } = await supabase.from('contact_messages').insert({ name, email, phone: phone || null, company: company || null, message, source }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Received', data });
});

app.get('/api/public/blog', requireSupabase, async (_req, res) => {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ posts: data || [] });
});

const chatbotAnswer = (message) => {
  const m = message.toLowerCase();
  if (/price|pricing|cost|budget/.test(m)) return 'Project pricing depends on scope, features and timeline. Tell me what you want to build and I can collect the details for the BrandSpire team.';
  if (/web|website/.test(m)) return 'We build responsive business websites, web apps, dashboards and portals with modern UI and scalable foundations.';
  if (/app|android|ios|mobile/.test(m)) return 'We build modern mobile app experiences with business-focused features and scalable architecture.';
  if (/saas|software|crm|pos|billing|inventory/.test(m)) return 'BrandSpire builds custom software such as CRM, POS, billing, inventory, automation and SaaS products.';
  if (/contact|call|phone|email|talk|human|agent|person/.test(m)) return '__AGENT__';
  if (/hello|hi|hey/.test(m)) return 'Hi! I’m the BrandSpire assistant. I can answer questions about our services or connect you with a human agent.';
  return null;
};

app.post('/api/chatbot/message', requireSupabase, async (req, res) => {
  const { sessionId, message, customer } = req.body || {};
  if (!sessionId || !message) return res.status(400).json({ error: 'sessionId and message are required.' });
  let { data: conversation } = await supabase.from('chat_conversations').select('*').eq('id', sessionId).maybeSingle();

  // A closed conversation is kept in Supabase for the admin history, but it
  // can never be reused by the public chatbot. The client will receive a
  // signal to start a fresh public session.
  if (conversation?.status === 'closed') {
    return res.status(410).json({ error: 'This chat has ended.', chatEnded: true });
  }

  if (!conversation) {
    const created = await supabase.from('chat_conversations').insert({ id: sessionId, customer_name: customer?.name || null, customer_email: customer?.email || null, status: 'bot' }).select().single();
    if (created.error) return res.status(500).json({ error: created.error.message });
    conversation = created.data;
  }
  await supabase.from('chat_messages').insert({ conversation_id: sessionId, sender_type: 'customer', message });

  // Once a human agent is connected, the chatbot must stop answering.
  // The customer message is still stored so the agent sees it in real time.
  if (conversation.status === 'connected') {
    await supabase.from('chat_conversations').update({ updated_at: new Date().toISOString() }).eq('id', sessionId);
    return res.json({ answer: null, handoff: false, agentConnected: true });
  }

  let answer = chatbotAnswer(message);
  let handoff = false;
  if (!answer && process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are BrandSpire website support. Answer briefly about services, software development, websites, apps, SaaS and project enquiries. If the user asks for a human or the answer is outside your knowledge, respond exactly ESCALATE.' }, { role: 'user', content: message }], temperature: 0.2 }) });
      const data = await r.json();
      answer = data?.choices?.[0]?.message?.content?.trim() || null;
      if (answer === 'ESCALATE') answer = '__AGENT__';
    } catch { answer = null; }
  }
  if (!answer) answer = '__AGENT__';
  if (answer === '__AGENT__') {
    handoff = true;
    await supabase.from('chat_conversations').update({ status: 'waiting', updated_at: new Date().toISOString() }).eq('id', sessionId);
    answer = 'I’m not confident I can answer that accurately. I’ve requested a BrandSpire team member. Please keep this chat open while we connect you.';
  }
  await supabase.from('chat_messages').insert({ conversation_id: sessionId, sender_type: 'bot', message: answer });
  res.json({ answer, handoff });
});

// Public chat history is intentionally view-only and is hidden immediately
// after the conversation is closed. The underlying conversation/messages are
// NOT deleted, so admins can still review the complete history.
app.get('/api/public/chat/:id', requireSupabase, async (req, res) => {
  const { data: conversation, error } = await supabase.from('chat_conversations').select('*').eq('id', req.params.id).maybeSingle();
  if (error || !conversation) return res.status(404).json({ error: 'Conversation not found.' });
  if (conversation.status === 'closed') {
    return res.json({ conversation: { ...conversation, status: 'closed' }, messages: [], publicHidden: true });
  }
  const { data: messages } = await supabase.from('chat_messages').select('*').eq('conversation_id', req.params.id).order('created_at', { ascending: true });
  res.json({ conversation, messages: messages || [], publicHidden: false });
});

app.post('/api/public/chat/:id/leave', requireSupabase, async (req, res) => {
  const { error } = await supabase.from('chat_conversations').update({ status: 'closed', closed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, publicHidden: true });
});

// Admin-only full conversation history. This keeps closed chats available to
// the admin panel while the public endpoint above hides them.
app.get('/api/admin/chats/:id/history', requireAdmin, async (req, res) => {
  const { data: conversation, error } = await supabase.from('chat_conversations').select('*').eq('id', req.params.id).maybeSingle();
  if (error || !conversation) return res.status(404).json({ error: 'Conversation not found.' });
  const { data: messages, error: messagesError } = await supabase.from('chat_messages').select('*').eq('conversation_id', req.params.id).order('created_at', { ascending: true });
  if (messagesError) return res.status(500).json({ error: messagesError.message });
  res.json({ conversation, messages: messages || [] });
});

app.get('/api/admin/dashboard', requireAdmin, async (_req, res) => {
  const [projects, services, reviews, messages, chats] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('chat_conversations').select('*', { count: 'exact', head: true }).eq('status', 'waiting')
  ]);
  res.json({ projects: projects.count || 0, services: services.count || 0, reviews: reviews.count || 0, newMessages: messages.count || 0, waitingChats: chats.count || 0 });
});

const resourceMap = {
  projects: { table: 'projects', order: 'sort_order' },
  services: { table: 'services', order: 'sort_order' },
  blog: { table: 'blog_posts', order: 'created_at' },
  media: { table: 'media_assets', order: 'created_at' },
};
for (const [route, config] of Object.entries(resourceMap)) {
  const { table, order } = config;
  app.get(`/api/admin/${route}`, requireAdmin, async (_req, res) => {
    const { data, error } = await supabase.from(table).select('*').order(order, { ascending: route === 'projects' || route === 'services' });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  });
  app.post(`/api/admin/${route}`, requireAdmin, async (req, res) => {
    const payload = { ...req.body };
    if (route === 'projects') {
      payload.tags = Array.isArray(payload.tags) ? payload.tags : [];
      payload.sort_order = Number(payload.sort_order || 0);
      payload.published = payload.published !== false;
    }
    if (route === 'services') {
      payload.sort_order = Number(payload.sort_order || 0);
      payload.published = payload.published !== false;
    }
    if (route === 'blog') {
      if (!payload.title || !payload.slug) return res.status(400).json({ error: 'Blog title and slug are required.' });
      payload.published = Boolean(payload.published);
    }
    if (route === 'media') {
      if (!payload.name || !payload.url) return res.status(400).json({ error: 'Media name and URL are required.' });
    }
    const { data, error } = await supabase.from(table).insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  });
  app.put(`/api/admin/${route}/:id`, requireAdmin, async (req, res) => {
    const payload = { ...req.body };
    delete payload.id;
    if (route === 'projects') { payload.tags = Array.isArray(payload.tags) ? payload.tags : []; payload.sort_order = Number(payload.sort_order || 0); }
    if (route === 'services') payload.sort_order = Number(payload.sort_order || 0);
    if (route === 'blog' && (!payload.title || !payload.slug)) return res.status(400).json({ error: 'Blog title and slug are required.' });
    const { data, error } = await supabase.from(table).update(payload).eq('id', req.params.id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });
  app.delete(`/api/admin/${route}/:id`, requireAdmin, async (req, res) => {
    const { error } = await supabase.from(table).delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).end();
  });
}

app.get('/api/admin/reviews', requireAdmin, async (_req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id,name,role,rating,text,published,created_at')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.put('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  const { name, role, rating, text, published } = req.body || {};
  const numericRating = Number(rating);
  if (!name?.trim() || !text?.trim()) return res.status(400).json({ error: 'Name and review are required.' });
  if (!Number.isInteger(numericRating) || numericRating < 0 || numericRating > 5) return res.status(400).json({ error: 'Rating must be between 0 and 5.' });
  if (String(name).trim().length > 80 || String(text).trim().length > 1200) return res.status(400).json({ error: 'Review is too long.' });
  const { data, error } = await supabase
    .from('reviews')
    .update({
      name: String(name).trim(),
      role: role ? String(role).trim() : null,
      rating: numericRating,
      text: String(text).trim(),
      published: Boolean(published),
    })
    .eq('id', req.params.id)
    .select('id,name,role,rating,text,published,created_at')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.patch('/api/admin/reviews/:id/published', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ published: Boolean(req.body?.published) })
    .eq('id', req.params.id)
    .select('id,name,role,rating,text,published,created_at')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('reviews').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

app.get('/api/admin/messages', requireAdmin, async (_req, res) => {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.patch('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  const allowed = new Set(['new','read','replied','archived']);
  const status = req.body.status || 'read';
  if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid message status.' });
  const { data, error } = await supabase.from('contact_messages').update({ status }).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get('/api/admin/chats', requireAdmin, async (_req, res) => {
  const { data, error } = await supabase.from('chat_conversations').select('*').order('updated_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.post('/api/admin/chats/:id/accept', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('chat_conversations').update({ status: 'connected', agent_id: req.user.id, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  await supabase.from('chat_messages').insert({ conversation_id: req.params.id, sender_type: 'agent', sender_id: req.user.id, message: 'Hi! You are now connected to a BrandSpire team member.' });
  res.json(data);
});

app.post('/api/admin/chats/:id/message', requireAdmin, async (req, res) => {
  if (!req.body.message) return res.status(400).json({ error: 'Message required.' });
  const { data, error } = await supabase.from('chat_messages').insert({ conversation_id: req.params.id, sender_type: 'agent', sender_id: req.user.id, message: req.body.message }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  await supabase.from('chat_conversations').update({ updated_at: new Date().toISOString() }).eq('id', req.params.id);
  res.status(201).json(data);
});

app.post('/api/admin/chats/:id/close', requireAdmin, async (req, res) => {
  await supabase.from('chat_conversations').update({ status: 'closed', closed_at: new Date().toISOString() }).eq('id', req.params.id);
  res.json({ ok: true });
});

app.get('/api/admin/settings', requireAdmin, async (_req,res)=>{ const {data,error}=await supabase.from('site_settings').select('*').order('key'); if(error)return res.status(500).json({error:error.message}); res.json(data||[]); });
app.put('/api/admin/settings/:key', requireAdmin, async (req,res)=>{ const {data,error}=await supabase.from('site_settings').upsert({key:req.params.key,value:req.body.value}).select().single(); if(error)return res.status(400).json({error:error.message}); res.json(data); });

const clientDist = path.join(__dirname, '..', 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`BrandSpire server running on http://localhost:${port}`));
