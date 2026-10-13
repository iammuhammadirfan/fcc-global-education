'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Save,
  Key,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  MessageSquare,
  Plus,
  Trash2,
  RotateCcw,
  Send,
  Sliders,
  ShieldCheck,
  HelpCircle,
  Globe,
} from 'lucide-react';
import { AiChatSettings } from '@/lib/types';
import { DEFAULT_AI_CHAT_SETTINGS } from '@/lib/ai-constants';

interface TestChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AdminAiBotPage() {
  const [settings, setSettings] = useState<AiChatSettings>(DEFAULT_AI_CHAT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Groq Connection Test
  const [testingGroq, setTestingGroq] = useState(false);
  const [groqTestResult, setGroqTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    reply?: string;
  } | null>(null);

  // Suggested Questions state
  const [newQuestionInput, setNewQuestionInput] = useState('');

  // Live Test Chat Sandbox state
  const [testMessages, setTestMessages] = useState<TestChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello Admin! 👋 I am your configured AI Admissions Counselor. Ask me any question (e.g. scholarships, UK universities, visas, or fees) to test my live responses!",
    },
  ]);
  const [testInput, setTestInput] = useState('');
  const [testingChat, setTestingChat] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load Settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/ai-bot');
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error('Failed to load AI bot settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Scroll chat sandbox
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [testMessages]);

  // Handle Save Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/ai-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_settings',
          settings,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to save settings.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error updating settings.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Test Groq API Key
  const handleTestGroqKey = async () => {
    if (!settings.groqApiKey?.trim()) {
      alert('Please enter your Groq API Key first (starts with "gsk_...").');
      return;
    }

    setTestingGroq(true);
    setGroqTestResult(null);

    try {
      const res = await fetch('/api/admin/ai-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_groq',
          groqApiKey: settings.groqApiKey,
          model: settings.model,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.model && data.model !== settings.model) {
          setSettings((prev) => ({ ...prev, model: data.model }));
        }
        setGroqTestResult({
          success: true,
          message: data.message || 'Groq API connection validated successfully!',
          latencyMs: data.latencyMs,
          reply: data.reply,
        });
      } else {
        setGroqTestResult({
          success: false,
          message: data.error || 'Groq API authentication failed. Please check the API key.',
          latencyMs: data.latencyMs,
        });
      }
    } catch (err: any) {
      setGroqTestResult({
        success: false,
        message: err?.message || 'Network error while contacting Groq.',
      });
    } finally {
      setTestingGroq(false);
    }
  };

  // Add Suggested Question
  const handleAddQuestion = () => {
    if (!newQuestionInput.trim()) return;
    setSettings((prev) => ({
      ...prev,
      suggestedQuestions: [...(prev.suggestedQuestions || []), newQuestionInput.trim()],
    }));
    setNewQuestionInput('');
  };

  // Remove Suggested Question
  const handleRemoveQuestion = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      suggestedQuestions: (prev.suggestedQuestions || []).filter((_, i) => i !== index),
    }));
  };

  // Reset System Prompt
  const handleResetPrompt = () => {
    if (confirm('Reset bot instructions and system prompt to recommended defaults?')) {
      setSettings((prev) => ({
        ...prev,
        systemPrompt: DEFAULT_AI_CHAT_SETTINGS.systemPrompt,
      }));
    }
  };

  // Send message in Admin Test Chat Sandbox
  const handleSendTestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = testInput.trim();
    if (!query || testingChat) return;

    const updated = [...testMessages, { role: 'user' as const, content: query }];
    setTestMessages(updated);
    setTestInput('');
    setTestingChat(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setTestMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.message.content,
          },
        ]);
      } else {
        setTestMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ Error: ${data.error || 'Failed to generate response.'}`,
          },
        ]);
      }
    } catch (err: any) {
      setTestMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Network error: ${err?.message || 'Failed to call chat API.'}`,
        },
      ]);
    } finally {
      setTestingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
        <p className="font-semibold text-sm">Loading AI Counselor Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Admissions Counselor (Groq API)
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                settings.enabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {settings.enabled ? 'Live on Website' : 'Disabled / Offline'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Control the 24/7 intelligent study abroad counselor, configure free Groq AI API keys, and test live conversations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSaveSettings()}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:brightness-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer min-w-[140px]"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>AI Chatbot settings have been successfully saved and updated across the live website!</span>
        </div>
      )}

      {/* Main Grid: Settings & Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* CARD 1: Groq API Key & Fast Verification */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  <Key className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Free Groq AI API Configuration
                  </h3>
                  <p className="text-xs text-slate-500">
                    Groq provides ultra-fast LLM inference with 100% free API tier access.
                  </p>
                </div>
              </div>

              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition inline-flex items-center gap-1"
              >
                <span>Get Free Groq Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-4 text-xs">
              {/* API Key Input */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Groq API Key <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.groqApiKey || ''}
                    onChange={(e) => setSettings({ ...settings, groqApiKey: e.target.value })}
                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Leave empty to use intelligent built-in local knowledge matching fallback.
                </p>
              </div>

              {/* Model Selector & Temperature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1.5 font-bold">Groq AI Model</label>
                  <select
                    value={settings.model || 'llama-3.1-8b-instant'}
                    onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
                  >
                    <option value="llama-3.1-8b-instant">
                      Llama 3.1 8B Instant (Recommended - 100% Free & Ultra Fast)
                    </option>
                    <option value="llama-3.3-70b-versatile">
                      Llama 3.3 70B Versatile (Meta 70B)
                    </option>
                    <option value="llama-3.1-70b-versatile">
                      Llama 3.1 70B Versatile
                    </option>
                    <option value="llama3-70b-8192">
                      Llama 3 70B (8192 Context)
                    </option>
                    <option value="llama3-8b-8192">
                      Llama 3 8B (8192 Context)
                    </option>
                    <option value="mixtral-8x7b-32768">
                      Mixtral 8x7B (Large Context 32k)
                    </option>
                    <option value="gemma2-9b-it">Gemma 2 9B (Google)</option>
                    <option value="deepseek-r1-distill-llama-70b">
                      DeepSeek R1 Distill Llama 70B
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1.5 font-bold">
                    Creativity / Temperature ({settings.temperature || 0.6})
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={settings.temperature || 0.6}
                    onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Precise (0.1)</span>
                    <span>Balanced (0.6)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>
              </div>

              {/* Test Groq Connection Button */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestGroqKey}
                  disabled={testingGroq}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {testingGroq ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Groq API...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Test Groq Connection</span>
                    </>
                  )}
                </button>

                {groqTestResult && (
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${
                      groqTestResult.success ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {groqTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>
                      {groqTestResult.success
                        ? `Connected (${groqTestResult.latencyMs}ms)`
                        : 'Verification Failed'}
                    </span>
                  </span>
                )}
              </div>

              {/* Test Result Message Box */}
              {groqTestResult && (
                <div
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    groqTestResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <p className="font-semibold">{groqTestResult.message}</p>
                  {groqTestResult.reply && (
                    <p className="text-[11px] text-emerald-800 font-mono italic">
                      "{groqTestResult.reply}"
                    </p>
                  )}
                  {!groqTestResult.success && settings.model !== 'llama-3.1-8b-instant' && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSettings({ ...settings, model: 'llama-3.1-8b-instant' });
                          setGroqTestResult(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Switch to Llama 3.1 8B Instant (100% Free on all Groq accounts)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: Bot Persona & Master Enable */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <Bot className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Bot Persona & Website Display
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customize the counselor name, greeting, and system instructions.
                  </p>
                </div>
              </div>

              {/* Master Switch */}
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-slate-700">Live Bot</span>
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Counselor Bot Display Name
                </label>
                <input
                  type="text"
                  value={settings.botName || ''}
                  onChange={(e) => setSettings({ ...settings, botName: e.target.value })}
                  placeholder="e.g. FCC AI Admissions Counselor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Initial Welcome Message
                </label>
                <textarea
                  rows={2}
                  value={settings.welcomeMessage || ''}
                  onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                  placeholder="Welcome message sent when student opens the chat widget..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white resize-y"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 font-bold">
                    System Prompt Instructions (AI Brain Rules)
                  </label>
                  <button
                    type="button"
                    onClick={handleResetPrompt}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Default</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={settings.systemPrompt || ''}
                  onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-500 font-medium focus:bg-white resize-y leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Note: Real-time website knowledge (countries, universities, fees, FAQs) is automatically appended to this prompt during every conversation!
                </p>
              </div>
            </div>
          </div>

          {/* CARD 3: Quick Suggested Prompts (FAQ Chips) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Suggested Questions / FAQ Chips
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chips shown to prospective students for 1-click answers.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestionInput}
                  onChange={(e) => setNewQuestionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQuestion();
                    }
                  }}
                  placeholder="e.g. Can I study abroad without IELTS?"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Chip</span>
                </button>
              </div>

              <div className="space-y-2">
                {(settings.suggestedQuestions || []).map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  >
                    <span>{q}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Remove question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: LIVE TEST CHAT SANDBOX (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col h-[680px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">
                    Live Counselor Sandbox
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    Connected to Website Knowledge
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTestMessages([
                    {
                      role: 'assistant',
                      content:
                        'Sandbox reset. Ask any question to test live responses with your current settings!',
                    },
                  ])
                }
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition"
                title="Clear test chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Test Chat Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 p-1 pr-2 text-xs">
              {testMessages.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={i}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-2xs leading-relaxed whitespace-pre-line ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-900 border border-slate-200/80 rounded-tl-none text-[11px]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {testingChat && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                  <span className="text-[11px]">Groq AI is thinking...</span>
                </div>
              )}
              <div ref={chatScrollRef} />
            </div>

            {/* Sandbox Quick Test Prompts */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase">
                Quick Test Prompts:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'What scholarships are available?',
                  'How to book an appointment?',
                  'UK visa requirements?',
                  'Office address and phone?',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={testingChat}
                    onClick={() => {
                      setTestInput(prompt);
                    }}
                    className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Sandbox Input Form */}
            <form onSubmit={handleSendTestChat} className="flex gap-2">
              <input
                type="text"
                value={testInput}
                disabled={testingChat}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type a test question..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!testInput.trim() || testingChat}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
