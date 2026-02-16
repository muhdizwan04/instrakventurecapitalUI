import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import styles from './ChatWidget.module.css';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Welcome to **Instrak Venture Capital**! 👋\n\nI'm here to help you explore our services — from Equity Financing to Virtual CFO and more.\n\nHow can I assist you today?"
};

const QUICK_ACTIONS = [
  'What services do you offer?',
  'I need funding',
  'Tell me about Virtual CFO',
  'How to contact you?'
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setShowQuickActions(false);

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Prepare messages for the API (only role + content)
      const apiMessages = newMessages
        .filter(m => m.role !== 'error')
        .map(({ role, content }) => ({ role, content }));

      // Use fetch directly for proper SSE streaming support
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Read the streamed response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

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
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) fullContent += delta;
            } catch {
              // Skip malformed JSON
            }
          }
        }

        // Live update the message as chunks arrive
        if (fullContent) {
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg?.role === 'assistant' && lastMsg?._streaming) {
              return [...prev.slice(0, -1), { role: 'assistant', content: fullContent, _streaming: true }];
            }
            return [...prev, { role: 'assistant', content: fullContent, _streaming: true }];
          });
        }
      }

      // Finalize the message (remove streaming flag)
      if (fullContent) {
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?._streaming) {
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
        {
          role: 'error',
          content: 'Sorry, I encountered an issue. Please try again or contact us directly.'
        }
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

  // Simple markdown-to-HTML for links and bold
  const renderContent = (text) => {
    let html = text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_self">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br/>');

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
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

          {/* Messages */}
          <div className={styles.messagesArea}>
            {/* Welcome */}
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

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {showQuickActions && messages.length <= 1 && (
            <div className={styles.quickActions}>
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  className={styles.quickAction}
                  onClick={() => sendMessage(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
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
        </div>
      )}

      {/* Floating Button */}
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
