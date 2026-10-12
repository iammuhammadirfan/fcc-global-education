'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  ExternalLink,
  Calendar,
  MessageCircle,
  ArrowUp,
  Zap,
} from 'lucide-react';
import { AiChatSettings } from '@/lib/types';
import { DEFAULT_AI_CHAT_SETTINGS } from '@/lib/ai-constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AiChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AiChatSettings>(DEFAULT_AI_CHAT_SETTINGS);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome-init',
      role: 'assistant',
      content: DEFAULT_AI_CHAT_SETTINGS.welcomeMessage,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch AI Bot Settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/ai-bot');
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
          if (data.settings.welcomeMessage) {
            setMessages((prev) => [
              {
                id: 'msg-welcome-loaded',
                role: 'assistant',
                content: data.settings.welcomeMessage,
                timestamp: 'Just now',
              },
              ...prev.slice(1),
            ]);
          }
        }
      } catch (err) {
        console.warn('[AI Widget Settings Load Error]:', err);
      }
    }
    loadSettings();
  }, []);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Don't display inside Admin Dashboard
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // If disabled by admin, don't show
  if (settings && settings.enabled === false) {
    return null;
  }

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await res.json();

      if (data.success && data.message) {
        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: data.message.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMsg: Message = {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content:
            data.error ||
            'I encountered a brief connection issue. Please connect with our counselors directly at [Book Appointment](/book-appointment) or on WhatsApp!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content:
            'Network connectivity hiccup. Please reach out to our counselors directly via [Book Appointment](/book-appointment) or WhatsApp.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Reset / Clear Chat
  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'assistant',
        content:
          settings?.welcomeMessage ||
          "Hello! 👋 I am FCC Global Education's AI Counselor. What would you like to explore next?",
        timestamp: 'Just now',
      },
    ]);
  };

  // Helper to render markdown links & formatting cleanly
  const renderMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <Link
          key={`${match.index}-${url}`}
          href={url}
          onClick={() => {
            if (url.startsWith('/')) setIsOpen(false);
          }}
          className="inline-flex items-center gap-1 font-bold text-amber-600 hover:text-amber-700 underline decoration-amber-400 underline-offset-2 mx-1"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline" />
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line">
        {parts.map((p, i) => (typeof p === 'string' ? <span key={i}>{p}</span> : p))}
      </div>
    );
  };

  const suggestedQuestions =
    settings?.suggestedQuestions && settings.suggestedQuestions.length > 0
      ? settings.suggestedQuestions
      : DEFAULT_AI_CHAT_SETTINGS.suggestedQuestions;

  return (
    <>
      {/* Floating Launcher Button - Visible ONLY when chat window is closed */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex items-center justify-end">
          {/* Unread teaser tooltip */}
          {hasUnread && (
            <div
              onClick={() => setIsOpen(true)}
              className="mr-3 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 text-white text-xs font-bold shadow-2xl border border-amber-500/40 cursor-pointer hover:bg-slate-950 transition-all group animate-in fade-in duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              <span className="text-slate-100 group-hover:text-amber-300 transition-colors">
                Ask AI Counselor ✨
              </span>
            </div>
          )}

          {/* Trigger Icon */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-slate-950 shadow-xl shadow-amber-500/35 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none"
            aria-label="Open AI Admissions Counselor"
            title="FCC AI Admissions Counselor"
          >
            <span className="absolute -inset-1 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-6 h-6 fill-slate-950/20" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white" />
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Luxury Chat Window Modal - Elegantly anchored on screen */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-[94vw] sm:w-[400px] max-w-[420px] h-[min(540px,calc(100vh-60px))] flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-950/30 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header Bar */}
          <div className="bg-slate-950 p-3.5 px-4 text-white flex items-center justify-between border-b border-amber-500/20 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-md font-extrabold">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white leading-tight">
                  {settings?.botName || 'FCC AI Admissions Counselor'}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-300/90 font-medium mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                  <span>Online 24/7 • Groq AI</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Counselor Action Pills */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-3.5 py-1.5 flex items-center justify-between text-[11px] font-bold shrink-0">
            <Link
              href="/book-appointment"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 transition"
            >
              <Calendar className="w-3 h-3 text-amber-600" />
              <span>Book Consultation</span>
            </Link>
            <span className="text-slate-300">•</span>
            <a
              href="https://wa.me/442079460912"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 transition"
            >
              <MessageCircle className="w-3 h-3 text-emerald-600" />
              <span>WhatsApp Helpline</span>
            </a>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/40">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                      isUser
                        ? 'bg-slate-900 text-amber-400'
                        : 'bg-amber-100 text-amber-800 border border-amber-300/60'
                    }`}
                  >
                    {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-2xs ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    {renderMessageContent(msg.content)}
                    <div
                      className={`text-[9px] mt-1 text-right font-mono ${
                        isUser ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-1">
                <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] font-semibold text-slate-600 ml-1">
                    Analyzing courses & visas...
                  </span>
                </div>
              </div>
            )}

            {/* Suggested Question Chips (Always show below welcome message) */}
            {messages.length <= 2 && (
              <div className="pt-2 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Frequently Asked Questions:</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={loading}
                      onClick={() => handleSendMessage(q)}
                      className="text-left text-xs font-semibold p-2 px-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 transition-all shadow-2xs group flex items-center justify-between"
                    >
                      <span>{q}</span>
                      <ArrowUp className="w-3 h-3 text-slate-300 group-hover:text-amber-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                disabled={loading}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about admissions, scholarships, visas..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                title="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
