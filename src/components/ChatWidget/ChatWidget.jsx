import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { MessageCircle, X, Send, Bot, ExternalLink, User, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './ChatWidget.module.css';
import { supabase } from '../../lib/supabase';

/** Must match `src/App.jsx` service routes */
const VALID_SERVICE_SLUGS = new Set([
  'virtual-cfo',
  'business-finance-consulting',
  'equity-financing',
  'real-estate-financing',
  'reits',
  'share-financing',
  'merger-acquisition',
  'tokenization',
  'asset-insurance',
  'ppli',
  'gig',
  'private-wealth',
  'aum',
]);

/**
 * Intent / headers often return human text ("Virtual CFO") or bad slugs.
 * Maps to a real `/services/:slug` path or null.
 */
function normalizeServiceSlug(raw) {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (!s || /^null$/i.test(s) || /^undefined$/i.test(s)) return null;
  s = s.replace(/^["']|["']$/g, '');
  const pathMatch = s.match(/\/services\/([^/?#]+)/i);
  if (pathMatch) s = pathMatch[1];
  s = s.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
  s = s.replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (VALID_SERVICE_SLUGS.has(s)) return s;
  if (s.includes('virtual') && s.includes('cfo')) return 'virtual-cfo';
  if (s.includes('business') && s.includes('finance') && s.includes('consult')) return 'business-finance-consulting';
  if (s.includes('equity') && s.includes('financ')) return 'equity-financing';
  if (s.includes('real') && s.includes('estate') && s.includes('financ')) return 'real-estate-financing';
  if (s === 'reit' || s === 'reits') return 'reits';
  if (s.includes('share') && s.includes('financ')) return 'share-financing';
  if (s.includes('merger') || s.includes('m&a') || s.includes('acquisition')) return 'merger-acquisition';
  if (s.includes('token')) return 'tokenization';
  if (s.includes('asset') && s.includes('insurance')) return 'asset-insurance';
  if (s.includes('private') && s.includes('wealth')) return 'private-wealth';
  if (s === 'aum' || s.includes('asset-under-management')) return 'aum';
  if (s === 'gig') return 'gig';
  if (s === 'ppli') return 'ppli';
  return null;
}

function formatServiceTitle(raw) {
  if (!raw) return 'this service';
  const slug = normalizeServiceSlug(raw);
  const token = slug || String(raw).trim().replace(/^["']|["']$/g, '');
  return token
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I am Maya, your AI Assistant!"
};

const QUICK_ACTIONS = [
  'What services do you offer?',
  'I need funding',
  'Tell me about Virtual CFO',
  'How to contact you?'
];

const INTENT_ACTIONS = {
  SERVICE_INQUIRY: [
    'Tell me more about this service',
    'What are the requirements?',
    'How do I apply?'
  ],
  FUNDING_REQUEST: [
    'What funding options do you have?',
    'What is the minimum investment?',
    'Schedule a consultation'
  ],
  CONTACT_REQUEST: [
    'Send me contact details',
    'Schedule a meeting',
    'Call me back'
  ],
  FORM_SUBMISSION: [
    'Fill inquiry form',
    'Apply now',
    'Get started'
  ],
  GENERAL_INFO: [
    'Tell me about your company',
    'What is your mission?',
    'View our services'
  ]
};

const getSessionId = () => {
  const stored = localStorage.getItem('chat_session_id');
  if (stored) return stored;
  const newId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('chat_session_id', newId);
  return newId;
};

const ChatWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [sessionId] = useState(() => getSessionId());
  const [currentIntent, setCurrentIntent] = useState(null);
  const [suggestedService, setSuggestedService] = useState(null);
  const resolvedServiceSlug = useMemo(() => normalizeServiceSlug(suggestedService), [suggestedService]);
  const serviceDetailPath = resolvedServiceSlug ? `/services/${resolvedServiceSlug}` : '/services';
  const messagesAreaRef = useRef(null);
  const inputRef = useRef(null);
  const autoScrollRef = useRef(true);
  const programmaticScrollRef = useRef(false);

  // Pre-chat visitor info
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem('chat_visitor_name') || '');
  const [visitorEmail, setVisitorEmail] = useState(() => localStorage.getItem('chat_visitor_email') || '');
  const [preChatDone, setPreChatDone] = useState(() => {
    const n = (localStorage.getItem('chat_visitor_name') || '').trim();
    const e = (localStorage.getItem('chat_visitor_email') || '').trim();
    return !!n && !!e;
  });

  const handlePreChatSubmit = (e) => {
    e.preventDefault();
    const name = visitorName.trim();
    const email = visitorEmail.trim();
    if (!name || !email) return;
    localStorage.setItem('chat_visitor_name', name);
    localStorage.setItem('chat_visitor_email', email);
    setVisitorName(name);
    setVisitorEmail(email);
    setPreChatDone(true);
  };

  // Scroll to bottom helper — sets programmatic flag so onScroll ignores it
  const scrollToBottom = useCallback(() => {
    const el = messagesAreaRef.current;
    if (!el) return;
    programmaticScrollRef.current = true;
    el.scrollTop = el.scrollHeight;
  }, []);

  // When user scrolls, decide if they scrolled away from bottom
  const handleMessagesScroll = useCallback(() => {
    if (programmaticScrollRef.current) {
      programmaticScrollRef.current = false;
      return;
    }
    const el = messagesAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    autoScrollRef.current = distFromBottom < 40;
  }, []);

  // Auto-scroll only when user is at the bottom
  useEffect(() => {
    if (autoScrollRef.current) scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Load conversation history on mount
  useEffect(() => {
    if (!sessionId) return;
    supabase
      .from('chat_conversations')
      .select('messages, intent, service_mentioned, visitor_name, visitor_email')
      .eq('session_id', sessionId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data || !Array.isArray(data.messages) || data.messages.length === 0) return;

        // Hydrate visitor identity if present (so admin doesn't see Anonymous for this session)
        if (data.visitor_name && data.visitor_email) {
          const n = String(data.visitor_name).trim();
          const e = String(data.visitor_email).trim();
          if (n && e) {
            localStorage.setItem('chat_visitor_name', n);
            localStorage.setItem('chat_visitor_email', e);
            setVisitorName(n);
            setVisitorEmail(e);
            setPreChatDone(true);
          }
        }

        const msgs = data.messages.filter(m => m.role !== 'system');
        if (msgs.length > 0) {
          setMessages(msgs);
          setShowQuickActions(false);
          if (data.intent) setCurrentIntent(data.intent);
          if (data.service_mentioned) setSuggestedService(data.service_mentioned);
        }
      })
      .catch(() => {});
  }, [sessionId]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Intercept link clicks inside messages for SPA navigation
  const handleMessageAreaClick = useCallback((e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;

    // Internal paths start with /
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      setIsOpen(false);
    }
  }, [navigate]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setShowQuickActions(false);
    autoScrollRef.current = true;

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiMessages = newMessages
        .filter(m => m.role !== 'error')
        .map(({ role, content }) => ({ role, content }));

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      let userId = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      } catch {
        // optional
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          sessionId,
          userId,
          visitorName: (visitorName || localStorage.getItem('chat_visitor_name') || '').trim() || null,
          visitorEmail: (visitorEmail || localStorage.getItem('chat_visitor_email') || '').trim() || null,
        }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const intent = response.headers.get('X-Intent');
      const service = response.headers.get('X-Service');
      if (intent) setCurrentIntent(intent);
      if (service) setSuggestedService(service);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let metadataReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === 'metadata' && !metadataReceived) {
                metadataReceived = true;
                if (parsed.intent) setCurrentIntent(parsed.intent);
                if (parsed.service) setSuggestedService(parsed.service);
                continue;
              }
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) fullContent += delta;
            } catch {
              // skip
            }
          }
        }

        if (fullContent) {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant' && last?._streaming) {
              return [...prev.slice(0, -1), { role: 'assistant', content: fullContent, _streaming: true }];
            }
            return [...prev, { role: 'assistant', content: fullContent, _streaming: true }];
          });
        }
      }

      if (fullContent) {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?._streaming) {
            return [...prev.slice(0, -1), { role: 'assistant', content: fullContent }];
          }
          return prev;
        });
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'error', content: 'Sorry, I encountered an issue. Please try again or contact us directly.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderContent = (text) => {
    const safeLinkRegex = /\[([^\]]+)\]\(((?:\/|https?:\/\/)[^\s)]+)\)/g;
    let s = text
      .replace(/Learn more\(((?:\/|https?:\/\/)[^)]+)\)/gi, '[Learn more]($1)')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(safeLinkRegex, '<a href="$2">$1</a>')
      .replace(/\*{2,}/g, '')
      .replace(/\n/g, '<br/>');
    return <span dangerouslySetInnerHTML={{ __html: s }} />;
  };

  return (
    <>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <Bot size={22} />
            </div>
            <div className={styles.headerInfo}>
              <h3 className={styles.headerTitle}>IVC AI Assistance</h3>
              <div className={styles.headerStatus}>
                <span className={styles.statusDot}></span>
                Online — Ready to help
              </div>
            </div>
          </div>

          {!preChatDone ? (
            <form className={styles.preChatForm} onSubmit={handlePreChatSubmit}>
              <div className={styles.preChatWelcome}>
                <div className={styles.preChatIconWrap}>
                  <Bot size={28} />
                </div>
                <p className={styles.preChatTitle}>Welcome to IVC!</p>
                <p className={styles.preChatSubtitle}>Please share your details so we can assist you better.</p>
              </div>
              <div className={styles.preChatField}>
                <User size={16} className={styles.preChatFieldIcon} />
                <input
                  className={styles.preChatInput}
                  type="text"
                  placeholder="Your Name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.preChatField}>
                <Mail size={16} className={styles.preChatFieldIcon} />
                <input
                  className={styles.preChatInput}
                  type="email"
                  placeholder="Your Email"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  required
                />
              </div>
              <button className={styles.preChatButton} type="submit">
                Start Chatting
              </button>
            </form>
          ) : (
          <>
          <div
            className={styles.messagesArea}
            ref={messagesAreaRef}
            onScroll={handleMessagesScroll}
            onClick={handleMessageAreaClick}
          >
            {messages.length <= 1 && (
              <div className={styles.welcome}>
                <p className={styles.welcomeTitle}>Instrak Venture Capital</p>
                <p className={styles.welcomeText}>
                  Your AI-powered assistant for investment & financing inquiries
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${
                  msg.role === 'user'
                    ? styles.user
                    : msg.role === 'error'
                    ? styles.error
                    : styles.assistant
                }`}
              >
                {renderContent(msg.content)}
              </div>
            ))}

            {isLoading && (
              <div className={styles.typing}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            )}
          </div>

          {showQuickActions && messages.length <= 1 && (
            <div className={styles.quickActions}>
              {QUICK_ACTIONS.map((action, i) => (
                <button key={i} className={styles.quickAction} onClick={() => sendMessage(action)}>
                  {action}
                </button>
              ))}
            </div>
          )}

          {currentIntent && messages.length > 1 && !isLoading && (
            <div className={styles.intentSuggestions}>
              <div className={styles.intentLabel}>
                {currentIntent === 'SERVICE_INQUIRY' && suggestedService && (
                  <>
                    <span>Interested in {formatServiceTitle(suggestedService)}?</span>
                    <Link
                      className={styles.intentButton}
                      to={serviceDetailPath}
                      onClick={() => setIsOpen(false)}
                    >
                      View Service <ExternalLink size={14} />
                    </Link>
                  </>
                )}
                {currentIntent === 'FUNDING_REQUEST' && (
                  <>
                    <span>Ready to explore funding options?</span>
                    <Link className={styles.intentButton} to="/investors" onClick={() => setIsOpen(false)}>
                      For Investors <ExternalLink size={14} />
                    </Link>
                  </>
                )}
                {currentIntent === 'CONTACT_REQUEST' && (
                  <>
                    <span>Want to get in touch?</span>
                    <Link className={styles.intentButton} to="/contact" onClick={() => setIsOpen(false)}>
                      Contact Us <ExternalLink size={14} />
                    </Link>
                  </>
                )}
                {currentIntent === 'FORM_SUBMISSION' && suggestedService && (
                  <>
                    <span>Ready to apply?</span>
                    <Link
                      className={styles.intentButton}
                      to={serviceDetailPath}
                      onClick={() => setIsOpen(false)}
                    >
                      Fill Inquiry Form <ExternalLink size={14} />
                    </Link>
                  </>
                )}
              </div>
              {INTENT_ACTIONS[currentIntent] && (
                <div className={styles.intentActions}>
                  {INTENT_ACTIONS[currentIntent].slice(0, 2).map((action, i) => (
                    <button key={i} className={styles.quickAction} onClick={() => sendMessage(action)}>
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our services..."
              disabled={isLoading}
            />
            <button
              className={styles.sendButton}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </div>
          </>
          )}
        </div>
      )}

      <button
        className={`${styles.chatButton} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && <span className={styles.badge}></span>}
      </button>
    </>
  );
};

export default ChatWidget;
