import { useEffect, useRef, useState } from 'react';
import { Send, X, PhoneCall, Volume2 } from 'lucide-react';
import { api } from '../lib.js';

const key = 'brandspire_chat_session';
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
const welcome = { role: 'bot', text: 'Hi! I’m the BrandSpire assistant. Ask me about our services, software, pricing, or say “connect me to an agent”.' };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(key) || makeId());
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const timer = useRef(null);

  const startFreshPublicChat = () => {
    const nextId = makeId();
    localStorage.setItem(key, nextId);
    setSessionId(nextId);
    setMessages([welcome]);
    setWaiting(false);
    setConnected(false);
    setInput('');
  };

  useEffect(() => { localStorage.setItem(key, sessionId); }, [sessionId]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    const poll = async () => {
      try {
        const data = await api(`/public/chat/${sessionId}`);
        if (!active) return;

        // Closed chats remain in Supabase for admins, but are instantly removed
        // from the public UI and replaced with a fresh session.
        if (data.publicHidden || data.conversation?.status === 'closed') {
          startFreshPublicChat();
          return;
        }

        const incoming = (data.messages || []).map(m => ({
          role: m.sender_type === 'customer' ? 'user' : 'bot',
          text: m.message
        }));
        setMessages(incoming.length ? incoming : [welcome]);
        setWaiting(data.conversation.status === 'waiting');
        setConnected(data.conversation.status === 'connected');
      } catch {}
    };
    poll();
    timer.current = setInterval(poll, 1800);
    return () => {
      active = false;
      clearInterval(timer.current);
    };
  }, [open, sessionId]);

  const send = async (text = input) => {
    text = text.trim();
    if (!text || sending) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setSending(true);
    try {
      const data = await api('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ sessionId, message: text })
      });
      // While a human agent is connected, the chatbot must stay silent.
      // The customer message is already visible and is delivered to the agent
      // through the normal admin chat polling flow.
      if (data.answer) {
        setMessages(m => [...m, { role: 'bot', text: data.answer }]);
      }
      if (data.handoff) setWaiting(true);
      if (data.agentConnected) setConnected(true);
    } catch (e) {
      if (e.message === 'This chat has ended.') {
        startFreshPublicChat();
      } else {
        setMessages(m => [...m, { role: 'bot', text: 'I’m having trouble connecting right now. Please use the contact form and our team will help you.' }]);
      }
    } finally {
      setSending(false);
    }
  };

  const leave = async () => {
    try {
      await api(`/public/chat/${sessionId}/leave`, { method: 'POST' });
    } catch {}
    // Clear the conversation from the public UI immediately. The Supabase
    // records remain untouched for the admin panel.
    startFreshPublicChat();
  };

  return <>
    <button className={`chat-fab ${open ? 'is-open' : ''}`} onClick={() => setOpen(v => !v)} aria-label="Open BrandSpire chatbot">
      {open ? <X /> : <><video className="chat-fab-video" src="/chatbot.mp4" autoPlay loop muted playsInline preload="auto" aria-hidden="true"/><span className="chat-fab-pulse" aria-hidden="true"/></>}
    </button>
    {open && <div className="chat-window">
      <div className="chat-head"><div><strong>BrandSpire Assistant</strong><small>{connected ? 'Agent connected' : waiting ? 'Waiting for an agent…' : 'Online'}</small></div><button onClick={() => setOpen(false)}><X size={17}/></button></div>
      <div className="chat-messages">{messages.map((m,i)=><div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>)}{waiting && <div className="agent-wait"><PhoneCall size={15}/> Connecting you to a BrandSpire agent…</div>}</div>
      <div className="chat-quick"><button onClick={() => send('What services do you offer?')}>Services</button><button onClick={() => send('Tell me about pricing')}>Pricing</button><button onClick={() => send('Connect me to an agent')}>Human agent</button></div>
      <form className="chat-input" onSubmit={e => {e.preventDefault(); send();}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message…"/><button><Send size={16}/></button></form>
      {(waiting || connected) && <button className="chat-leave" onClick={leave}><Volume2 size={14}/> Leave chat</button>}
    </div>}
  </>;
}
