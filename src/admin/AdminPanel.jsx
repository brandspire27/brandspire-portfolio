import { useEffect, useRef, useState } from 'react';
import {
  LogOut, LayoutDashboard, BriefcaseBusiness, Wrench, Mail, MessageCircle,
  Plus, Trash2, CheckCircle2, Volume2, Star, Pencil, Eye, EyeOff,
  FileText, Image as ImageIcon, Settings, RefreshCw, Save, X, ExternalLink
} from 'lucide-react';
import { api, supabase } from '../lib.js';
import './admin.css';

const emptyProject = { title:'', category:'', description:'', link:'', tags:[], published:true, sort_order:0 };
const emptyService = { title:'', text:'', link:'', published:true, sort_order:0 };
const emptyReview = { name:'', role:'', rating:5, text:'', published:true };
const emptyBlog = { title:'', slug:'', excerpt:'', content:'', featured_image:'', category:'', published:false };
const emptyMedia = { name:'', url:'', type:'image' };

function Ring({ active }) {
  const ctx = useRef(null);
  useEffect(() => {
    if (!active) return;
    let stop = false;
    const beep = () => {
      if (stop) return;
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) {
        const c = ctx.current || new C();
        ctx.current = c;
        const o = c.createOscillator();
        const g = c.createGain();
        o.frequency.value = 740;
        g.gain.value = .045;
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + .18);
      }
      setTimeout(beep, 900);
    };
    beep();
    return () => { stop = true; };
  }, [active]);
  return active ? <div className="ringing"><Volume2 size={18}/> New customer is waiting for an agent</div> : null;
}

const slugify = value => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [dash, setDash] = useState({});
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [blog, setBlog] = useState([]);
  const [media, setMedia] = useState([]);
  const [settings, setSettings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [editing, setEditing] = useState(null);
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [reviewEditing, setReviewEditing] = useState(null);
  const [blogForm, setBlogForm] = useState(emptyBlog);
  const [blogEditing, setBlogEditing] = useState(null);
  const [mediaForm, setMediaForm] = useState(emptyMedia);
  const [mediaEditing, setMediaEditing] = useState(null);
  const [login, setLogin] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [chatText, setChatText] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!session) return;
    try {
      setError('');
      const d = await api('/admin/dashboard');
      setDash(d);
      if (tab === 'projects') setProjects(await api('/admin/projects'));
      if (tab === 'services') setServices(await api('/admin/services'));
      if (tab === 'reviews') setReviews(await api('/admin/reviews'));
      if (tab === 'blog') setBlog(await api('/admin/blog'));
      if (tab === 'media') setMedia(await api('/admin/media'));
      if (tab === 'settings') setSettings(await api('/admin/settings'));
      if (tab === 'messages') setMessages(await api('/admin/messages'));
      if (tab === 'chat') setChats(await api('/admin/chats'));
    } catch (e) { setError(e.message); }
  };

  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => setSession(data.session));
    const sub = supabase?.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub?.data?.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) load(); }, [session, tab]);
  useEffect(() => {
    if (!session) return;
    const t = setInterval(() => load(), 3000);
    return () => clearInterval(t);
  }, [session, tab]);

  const signIn = async e => {
    e.preventDefault(); setError('');
    if (!supabase) return setError('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.');
    const { data, error: authError } = await supabase.auth.signInWithPassword(login);
    if (authError) setError(authError.message); else setSession(data.session);
  };
  const signOut = () => supabase?.auth.signOut();

  const saveResource = async type => {
    try {
      setLoading(true);
      if (editing) await api(`/admin/${type}/${editing}`, { method:'PUT', body:JSON.stringify(form) });
      else await api(`/admin/${type}`, { method:'POST', body:JSON.stringify(form) });
      setEditing(null); setForm(type === 'projects' ? emptyProject : emptyService); await load();
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const toggleResource = async (type, item) => {
    try { await api(`/admin/${type}/${item.id}`, { method:'PUT', body:JSON.stringify({ ...item, published: !item.published }) }); await load(); }
    catch (e) { setError(e.message); }
  };
  const remove = async (type, id) => {
    if (!confirm('Delete this item permanently?')) return;
    try { await api(`/admin/${type}/${id}`, { method:'DELETE' }); await load(); }
    catch (e) { setError(e.message); }
  };

  const saveReview = async () => {
    try {
      if (!reviewEditing) return;
      await api(`/admin/reviews/${reviewEditing}`, { method:'PUT', body:JSON.stringify(reviewForm) });
      setReviewEditing(null); setReviewForm(emptyReview); await load();
    } catch (e) { setError(e.message); }
  };
  const toggleReview = async review => {
    try { await api(`/admin/reviews/${review.id}/published`, { method:'PATCH', body:JSON.stringify({ published:!review.published }) }); await load(); }
    catch (e) { setError(e.message); }
  };
  const removeReview = async id => {
    if (!confirm('Delete this review permanently?')) return;
    try {
      await api(`/admin/reviews/${id}`, { method:'DELETE' });
      if (reviewEditing === id) { setReviewEditing(null); setReviewForm(emptyReview); }
      await load();
    } catch (e) { setError(e.message); }
  };

  const saveBlog = async () => {
    try {
      const payload = { ...blogForm, slug: slugify(blogForm.slug || blogForm.title) };
      if (!payload.title || !payload.slug) throw new Error('Blog title is required.');
      if (blogEditing) await api(`/admin/blog/${blogEditing}`, { method:'PUT', body:JSON.stringify(payload) });
      else await api('/admin/blog', { method:'POST', body:JSON.stringify(payload) });
      setBlogEditing(null); setBlogForm(emptyBlog); await load();
    } catch (e) { setError(e.message); }
  };
  const toggleBlog = item => api(`/admin/blog/${item.id}`, { method:'PUT', body:JSON.stringify({ ...item, published:!item.published }) }).then(load).catch(e=>setError(e.message));

  const saveMedia = async () => {
    try {
      if (!mediaForm.name || !mediaForm.url) throw new Error('Media name and URL are required.');
      if (mediaEditing) await api(`/admin/media/${mediaEditing}`, { method:'PUT', body:JSON.stringify(mediaForm) });
      else await api('/admin/media', { method:'POST', body:JSON.stringify(mediaForm) });
      setMediaEditing(null); setMediaForm(emptyMedia); await load();
    } catch (e) { setError(e.message); }
  };

  const updateMessageStatus = async (id, status) => {
    try { await api(`/admin/messages/${id}`, { method:'PATCH', body:JSON.stringify({ status }) }); await load(); }
    catch (e) { setError(e.message); }
  };

  const accept = async id => { try { await api(`/admin/chats/${id}/accept`, { method:'POST' }); await load(); setSelected(id); } catch(e){setError(e.message);} };
  const sendAgent = async () => {
    if (!selected || !chatText.trim()) return;
    try { await api(`/admin/chats/${selected}/message`, { method:'POST', body:JSON.stringify({ message:chatText }) }); setChatText(''); }
    catch(e){setError(e.message);}
  };

  if (!session) return <div className="admin-login"><form onSubmit={signIn}><div className="admin-logo">Brand<span>Spire</span></div><h1>Admin Portal</h1><p>Secure access for website management and live support.</p><input placeholder="Admin email" type="email" value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} required/><input placeholder="Password" type="password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} required/>{error&&<div className="admin-error">{error}</div>}<button>Sign in</button><small>Create the admin user in Supabase Auth and add its UUID to <code>admin_profiles</code>.</small></form></div>;

  const nav = [
    ['dashboard','Dashboard',LayoutDashboard], ['projects','Projects',BriefcaseBusiness], ['services','Services',Wrench],
    ['reviews','Reviews',Star], ['blog','Blog',FileText], ['media','Media',ImageIcon], ['settings','Settings',Settings],
    ['messages','Messages',Mail], ['chat','Live Chat',MessageCircle]
  ];
  const waiting = chats.some(c => c.status === 'waiting');

  return <div className="admin-shell">
    <aside>
      <div className="admin-logo">Brand<span>Spire</span></div>
      {nav.map(([id,label,I]) => <button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}><I size={18}/>{label}{id==='chat'&&waiting?<b>{chats.filter(c=>c.status==='waiting').length}</b>:null}</button>)}
      <button className="logout" onClick={signOut}><LogOut size={18}/>Logout</button>
    </aside>
    <main className="admin-main">
      <header><div><span className="admin-kicker">CONTROL CENTER</span><h1>{nav.find(x=>x[0]===tab)?.[1]}</h1></div><div className="admin-user">{session.user.email}</div></header>
      <div className="admin-top-actions"><button onClick={load}><RefreshCw size={15}/> Refresh</button></div>
      <Ring active={waiting}/>{error&&<div className="admin-error">{error}<button onClick={()=>setError('')}><X size={14}/></button></div>}

      {tab==='dashboard'&&<div className="stat-grid">{[['Projects',dash.projects],['Services',dash.services],['Reviews',dash.reviews],['New messages',dash.newMessages],['Waiting chats',dash.waitingChats]].map(([a,b])=><div className="stat-card" key={a}><span>{a}</span><strong>{b||0}</strong></div>)}</div>}

      {tab==='reviews'&&<div className="reviews-admin"><div className="admin-toolbar"><div><strong>{reviews.length}</strong> total reviews <span className="reviews-admin-muted">· {reviews.filter(r=>r.published).length} visible</span></div></div><div className="admin-grid reviews-admin-grid"><div className="admin-list">{reviews.length===0?<div className="empty reviews-empty">No reviews yet.</div>:reviews.map(review=><div className="review-admin-row" key={review.id}><div className="review-admin-content"><div className="review-admin-title"><strong>{review.name}</strong>{review.role&&<span>· {review.role}</span>}<span className={`status ${review.published?'published':'hidden'}`}>{review.published?'Published':'Hidden'}</span></div><div className="review-admin-stars">{[1,2,3,4,5].map(n=><Star key={n} size={14} fill={n<=Number(review.rating)?'currentColor':'none'}/>)}</div><p>{review.text}</p><small>{new Date(review.created_at).toLocaleString()}</small></div><div className="review-admin-actions"><button onClick={()=>toggleReview(review)}>{review.published?<EyeOff size={15}/>:<Eye size={15}/>}<span>{review.published?'Hide':'Publish'}</span></button><button onClick={()=>{setReviewEditing(review.id);setReviewForm({name:review.name||'',role:review.role||'',rating:Number(review.rating||0),text:review.text||'',published:Boolean(review.published)})}}><Pencil size={15}/><span>Edit</span></button><button className="danger" onClick={()=>removeReview(review.id)}><Trash2 size={15}/><span>Delete</span></button></div></div>)}</div><div className="editor review-editor"><h3>{reviewEditing?'Edit review':'Select a review'}</h3>{reviewEditing?<><label>Name<input value={reviewForm.name} onChange={e=>setReviewForm({...reviewForm,name:e.target.value})}/></label><label>Role / company<input value={reviewForm.role} onChange={e=>setReviewForm({...reviewForm,role:e.target.value})}/></label><label>Rating<select value={reviewForm.rating} onChange={e=>setReviewForm({...reviewForm,rating:Number(e.target.value)})}><option value={0}>0 stars</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} star{n>1?'s':''}</option>)}</select></label><label>Review<textarea rows="7" value={reviewForm.text} onChange={e=>setReviewForm({...reviewForm,text:e.target.value})}/></label><label className="check-row"><input type="checkbox" checked={reviewForm.published} onChange={e=>setReviewForm({...reviewForm,published:e.target.checked})}/> Show on website</label><div className="button-row"><button className="primary" onClick={saveReview}><Save size={15}/>Save review</button><button onClick={()=>{setReviewEditing(null);setReviewForm(emptyReview)}}>Cancel</button></div></>:<p className="reviews-admin-help">Choose a review to edit its author, rating, text, or visibility.</p>}</div></div></div>}

      {(tab==='projects'||tab==='services')&&<><div className="admin-toolbar"><button className="primary" onClick={()=>{setEditing(null);setForm(tab==='projects'?emptyProject:emptyService)}}><Plus size={16}/> Add {tab==='projects'?'project':'service'}</button></div><div className="admin-grid"><div className="admin-list">{(tab==='projects'?projects:services).length===0?<div className="empty">No {tab} found.</div>:(tab==='projects'?projects:services).map(item=><div className="admin-row" key={item.id}><div><strong>{item.title}</strong><p>{tab==='projects'?item.category:item.text}</p><span className={`status ${item.published?'published':'hidden'}`}>{item.published?'Published':'Hidden'}</span></div><div className="row-actions"><button onClick={()=>toggleResource(tab,item)}>{item.published?<EyeOff size={15}/>:<Eye size={15}/>} {item.published?'Hide':'Publish'}</button><button onClick={()=>{setEditing(item.id);setForm({...item,tags:Array.isArray(item.tags)?item.tags:[]})}}><Pencil size={15}/> Edit</button><button className="danger" onClick={()=>remove(tab,item.id)}><Trash2 size={15}/></button></div></div>)}</div><div className="editor"><h3>{editing?'Edit':'Add'} {tab==='projects'?'project':'service'}</h3>{(tab==='projects'?[['title','Title'],['category','Category'],['description','Description'],['link','Project URL']]:[['title','Title'],['text','Description'],['link','Page URL']]).map(([k,l])=><label key={k}>{l}{k==='description'||k==='text'?<textarea rows="5" value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>:<input value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>}</label>)}{tab==='projects'&&<label>Tags (comma separated)<input value={Array.isArray(form.tags)?form.tags.join(', '):form.tags||''} onChange={e=>setForm({...form,tags:e.target.value.split(',').map(x=>x.trim()).filter(Boolean)})}/></label>}<label>Sort order<input type="number" value={form.sort_order??0} onChange={e=>setForm({...form,sort_order:Number(e.target.value)})}/></label><label className="check-row"><input type="checkbox" checked={Boolean(form.published)} onChange={e=>setForm({...form,published:e.target.checked})}/> Published on website</label><div className="button-row"><button className="primary" onClick={()=>saveResource(tab)} disabled={loading}><Save size={15}/>{loading?'Saving…':'Save changes'}</button><button onClick={()=>{setEditing(null);setForm(tab==='projects'?emptyProject:emptyService)}}>Clear</button></div></div></div></>}

      {tab==='blog'&&<div className="admin-grid"><div className="admin-list"><div className="admin-toolbar"><button className="primary" onClick={()=>{setBlogEditing(null);setBlogForm(emptyBlog)}}><Plus size={16}/> New post</button></div>{blog.length===0?<div className="empty">No blog posts yet.</div>:blog.map(x=><div className="admin-row" key={x.id}><div><strong>{x.title}</strong><p>/{x.slug} · {x.category||'Uncategorized'}</p><span className={`status ${x.published?'published':'hidden'}`}>{x.published?'Published':'Draft'}</span></div><div className="row-actions"><button onClick={()=>toggleBlog(x)}>{x.published?<EyeOff size={15}/>:<Eye size={15}/>} {x.published?'Unpublish':'Publish'}</button><button onClick={()=>{setBlogEditing(x.id);setBlogForm({...emptyBlog,...x})}}><Pencil size={15}/> Edit</button><button className="danger" onClick={()=>remove('blog',x.id)}><Trash2 size={15}/></button></div></div>)}</div><div className="editor"><h3>{blogEditing?'Edit post':'Create post'}</h3><label>Title<input value={blogForm.title} onChange={e=>setBlogForm({...blogForm,title:e.target.value,slug:blogEditing?blogForm.slug:slugify(e.target.value)})}/></label><label>Slug<input value={blogForm.slug} onChange={e=>setBlogForm({...blogForm,slug:slugify(e.target.value)})}/></label><label>Category<input value={blogForm.category} onChange={e=>setBlogForm({...blogForm,category:e.target.value})}/></label><label>Featured image URL<input value={blogForm.featured_image} onChange={e=>setBlogForm({...blogForm,featured_image:e.target.value})}/></label><label>Excerpt<textarea rows="4" value={blogForm.excerpt} onChange={e=>setBlogForm({...blogForm,excerpt:e.target.value})}/></label><label>Content<textarea rows="10" value={blogForm.content} onChange={e=>setBlogForm({...blogForm,content:e.target.value})}/></label><label className="check-row"><input type="checkbox" checked={Boolean(blogForm.published)} onChange={e=>setBlogForm({...blogForm,published:e.target.checked})}/> Publish this post</label><div className="button-row"><button className="primary" onClick={saveBlog}><Save size={15}/>Save post</button><button onClick={()=>{setBlogEditing(null);setBlogForm(emptyBlog)}}>Clear</button></div></div></div>}

      {tab==='media'&&<div className="admin-grid"><div className="admin-list"><div className="admin-toolbar"><button className="primary" onClick={()=>{setMediaEditing(null);setMediaForm(emptyMedia)}}><Plus size={16}/> Add media URL</button></div>{media.length===0?<div className="empty">No media assets yet.</div>:media.map(x=><div className="admin-row" key={x.id}><div className="media-item"><div className="media-preview">{x.type?.startsWith('image')?<img src={x.url} alt="" onError={e=>e.currentTarget.style.display='none'}/>:<FileText size={24}/>}</div><div><strong>{x.name}</strong><p>{x.url}</p><span className="status">{x.type||'asset'}</span></div></div><div className="row-actions"><a href={x.url} target="_blank" rel="noreferrer" className="icon-link"><ExternalLink size={15}/></a><button onClick={()=>{setMediaEditing(x.id);setMediaForm({...emptyMedia,...x})}}><Pencil size={15}/> Edit</button><button className="danger" onClick={()=>remove('media',x.id)}><Trash2 size={15}/></button></div></div>)}</div><div className="editor"><h3>{mediaEditing?'Edit asset':'Add asset'}</h3><label>Name<input value={mediaForm.name} onChange={e=>setMediaForm({...mediaForm,name:e.target.value})}/></label><label>Public URL<input value={mediaForm.url} onChange={e=>setMediaForm({...mediaForm,url:e.target.value})}/></label><label>Type<select value={mediaForm.type} onChange={e=>setMediaForm({...mediaForm,type:e.target.value})}><option value="image">Image</option><option value="video">Video</option><option value="document">Document</option><option value="other">Other</option></select></label><div className="button-row"><button className="primary" onClick={saveMedia}><Save size={15}/>Save asset</button><button onClick={()=>{setMediaEditing(null);setMediaForm(emptyMedia)}}>Clear</button></div></div></div>}

      {tab==='settings'&&<div className="admin-list settings-list">{settings.length===0?<div className="empty">No settings found.</div>:settings.map(x=><SettingRow key={x.key} item={x} onSaved={load} onError={setError}/>)}</div>}

      {tab==='messages'&&<div className="admin-list">{messages.length===0?<div className="empty">No contact messages yet.</div>:messages.map(m=><div className="message-row" key={m.id}><div><strong>{m.name} · {m.email}</strong>{m.company&&<span className="message-company"> · {m.company}</span>}<p>{m.message}</p><small>{new Date(m.created_at).toLocaleString()} · {m.source||'website'}</small></div><div className="message-actions"><select value={m.status} onChange={e=>updateMessageStatus(m.id,e.target.value)}><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select><a href={`mailto:${m.email}`}><Mail size={15}/> Reply</a></div></div>)}</div>}

      {tab==='chat'&&<div className="chat-admin-layout"><div className="admin-list chat-list">{chats.length===0?<div className="empty">No conversations yet.</div>:chats.map(c=><button className={`chat-ticket ${selected===c.id?'selected':''}`} onClick={()=>setSelected(c.id)} key={c.id}><strong>{c.customer_name||'Website visitor'}</strong><span>{c.status}</span><small>{new Date(c.updated_at).toLocaleString()}</small>{c.status==='waiting'&&<b>RINGING</b>}</button>)}</div><div className="agent-panel">{selected?<AgentChat id={selected} onAccept={accept}/>:<div className="empty">Select a customer conversation.</div>}</div></div>}
    </main>
  </div>;
}

function SettingRow({ item, onSaved, onError }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(JSON.stringify(item.value));
  const save = async () => {
    try {
      let parsed; try { parsed = JSON.parse(value); } catch { parsed = value; }
      await api(`/admin/settings/${encodeURIComponent(item.key)}`, { method:'PUT', body:JSON.stringify({value:parsed}) });
      setEditing(false); onSaved();
    } catch(e){onError(e.message);}
  };
  return <div className="admin-row settings-row"><div><strong>{item.key}</strong>{editing?<textarea value={value} onChange={e=>setValue(e.target.value)} rows="3"/>:<p>{JSON.stringify(item.value)}</p>}</div><div className="row-actions">{editing?<><button onClick={save}><Save size={15}/> Save</button><button onClick={()=>setEditing(false)}>Cancel</button></>:<button onClick={()=>{setValue(JSON.stringify(item.value));setEditing(true)}}><Pencil size={15}/> Edit</button>}</div></div>;
}

function AgentChat({ id, onAccept }) {
  const [data, setData] = useState(null);
  const [text, setText] = useState('');
  const load = () => api(`/admin/chats/${id}/history`).then(setData).catch(()=>{});
  useEffect(() => { load(); const t=setInterval(load,1500); return()=>clearInterval(t); }, [id]);
  const send = async () => { if(!text.trim()) return; await api(`/admin/chats/${id}/message`,{method:'POST',body:JSON.stringify({message:text})}); setText(''); load(); };
  const close = async () => { await api(`/admin/chats/${id}/close`,{method:'POST'}); load(); };
  if(!data) return <div className="empty">Loading…</div>;
  const connected = data.conversation.status === 'connected';
  return <div className="agent-chat"><div className="agent-chat-head"><div><strong>{data.conversation.customer_name||'Website visitor'}</strong><span>{data.conversation.status}{data.conversation.customer_email?` · ${data.conversation.customer_email}`:''}</span></div><div>{data.conversation.status==='waiting'&&<button className="primary" onClick={()=>onAccept(id)}><CheckCircle2 size={15}/> Accept & connect</button>}{connected&&<button onClick={close}>Close chat</button>}</div></div><div className="agent-messages">{data.messages.map(m=><div key={m.id} className={`agent-msg ${m.sender_type}`}><span>{m.sender_type}</span>{m.message}</div>)}</div>{connected&&<form className="agent-input" onSubmit={e=>{e.preventDefault();send()}}><input value={text} onChange={e=>setText(e.target.value)} placeholder="Reply to customer…"/><button>Send</button></form>}{data.conversation.status==='closed'&&<div className="closed-note">Chat ended. History remains available to admin.</div>}</div>;
}
