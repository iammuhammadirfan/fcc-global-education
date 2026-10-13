import { NextResponse } from 'next/server';
import {
  getAiChatSettings,
  buildWebsiteKnowledgeContext,
  generateLocalFallbackResponse,
} from '@/lib/ai-bot';

// Helper: Call Free Dynamic Generic LLM
async function callGenericLlm(messages: any[], systemInstruction: string): Promise<string | null> {
  try {
    const formattedMessages = [
      { role: 'system', content: systemInstruction },
      ...messages.slice(-6).map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content || ''),
      })),
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 28000);

    // Streamline prompt for speed while preserving quality and language instruction
    const streamlinedInstruction = `You are the Official Senior AI Education Counselor for FCC Global Education (Mayfair, London).
Accurately answer ANY question asked by the user in depth.
- If the user writes in Roman Urdu or Urdu, reply warmly in Roman Urdu or Urdu with clear formatting!
- If the user writes in English, reply in articulate British/International English.
- Provide accurate advice on study abroad, top universities, admissions, tuition costs, visas, scholarships, IELTS waivers, or general queries.
- Suggest [Book Free Consultation](/book-appointment) or WhatsApp when relevant.`;

    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: streamlinedInstruction },
          ...messages.slice(-5).map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: String(m.content || ''),
          })),
        ],
        model: 'openai',
        seed: Math.floor(Math.random() * 100000),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 5) {
        return text.trim();
      }
    }
    return null;
  } catch (e) {
    console.warn('[Generic LLM Engine Notice]:', e);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incomingMessages = body.messages || [];

    if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    const settings = await getAiChatSettings();

    // Check if enabled
    if (settings.enabled === false) {
      return NextResponse.json({
        success: false,
        error: 'The AI Admissions Counselor is currently offline. Please contact us via WhatsApp or book an appointment directly.',
      });
    }

    // Get latest user message
    const latestUserMsg =
      incomingMessages[incomingMessages.length - 1]?.content || 'Hello';

    // Build dynamic knowledge base from real website tables
    const knowledgeContext = await buildWebsiteKnowledgeContext();

    const systemInstruction = `
You are the Official Senior AI Education Counselor & Admissions Advisor for "FCC Global Education" (Headquartered in Berkeley Square House, Mayfair, London, with global branches).

YOUR CORE CAPABILITIES:
- You are a full, highly intelligent, dynamic LLM model. You can accurately and helpfully answer ANY question asked by the user, whether it is about study abroad, university admissions, scholarships, visas, living costs, IELTS/PTE waivers, comparisons, general questions, or academic advice.
- LANGUAGE ADAPTABILITY:
  * If the user writes in Urdu or Roman Urdu (e.g. "kya haal hai", "mujhe UK jana hai", "visa lagne me kitna time lagta hai"), reply in clear, natural Roman Urdu or Urdu with warmth and clarity!
  * If the user writes in English, reply in professional, articulate British/International English.
- Always be accurate, polite, and deeply knowledgeable.
- Use clean Markdown with headers (###), bullet points, bold key phrases, or comparison tables when answering complex queries.
- When answering questions about universities, programs, or study destinations, provide realistic and helpful guidance.
- Warmly encourage users to book a free 1-on-1 counseling appointment when appropriate: [Book Free Consultation](/book-appointment) or contact via WhatsApp.

REAL-TIME FCC GLOBAL EDUCATION DATABASE & WEBSITE INFORMATION:
${knowledgeContext}

ADDITIONAL ADMIN INSTRUCTIONS:
${settings.systemPrompt || ''}
`;

    const apiKey = (settings.groqApiKey || process.env.GROQ_API_KEY || '').trim();

    // 1. Tier 1: If Groq API Key is configured, use Groq ultra-fast Llama-3.3-70B
    if (apiKey) {
      try {
        const groqMessages = [
          { role: 'system', content: systemInstruction },
          ...incomingMessages.slice(-6).map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: String(m.content || ''),
          })),
        ];

        let groqModel = settings.model || 'llama-3.1-8b-instant';
        let groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: groqModel,
            messages: groqMessages,
            temperature: settings.temperature || 0.6,
            max_tokens: 1024,
          }),
        });

        if (!groqResponse.ok && groqModel !== 'llama-3.1-8b-instant') {
          // Automatic fallback to universal free Groq model
          groqModel = 'llama-3.1-8b-instant';
          groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: groqModel,
              messages: groqMessages,
              temperature: settings.temperature || 0.6,
              max_tokens: 1024,
            }),
          });
        }

        if (groqResponse.ok) {
          const resData = await groqResponse.json();
          const aiReply = resData.choices?.[0]?.message?.content?.trim();

          if (aiReply) {
            return NextResponse.json({
              success: true,
              provider: 'groq',
              model: groqModel,
              message: {
                role: 'assistant',
                content: aiReply,
              },
            });
          }
        } else {
          const errData = await groqResponse.json().catch(() => ({}));
          console.warn('[Groq API Notice - Switching to generic LLM pipeline]:', errData);
        }
      } catch (groqErr) {
        console.warn('[Groq Notice - Switching to generic LLM pipeline]:', groqErr);
      }
    }

    // 2. Tier 2: Full Dynamic Generic LLM Model (Zero-key required, live high-intelligence reasoning)
    const genericLlmReply = await callGenericLlm(incomingMessages, systemInstruction);
    if (genericLlmReply) {
      return NextResponse.json({
        success: true,
        provider: 'generic_llm',
        model: 'dynamic-llm',
        message: {
          role: 'assistant',
          content: genericLlmReply,
        },
      });
    }

    // 3. Tier 3: Local Intelligent Knowledge Base Engine (Offline Fallback)
    const fallbackAnswer = generateLocalFallbackResponse(latestUserMsg, knowledgeContext);

    return NextResponse.json({
      success: true,
      provider: 'knowledge_engine',
      message: {
        role: 'assistant',
        content: fallbackAnswer,
      },
    });
  } catch (error: any) {
    console.error('[AI Chat API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process AI chat message.',
      },
      { status: 500 }
    );
  }
}
