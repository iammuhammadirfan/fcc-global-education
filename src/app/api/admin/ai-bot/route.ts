import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAiChatSettings, DEFAULT_AI_CHAT_SETTINGS } from '@/lib/ai-bot';
import { AiChatSettings } from '@/lib/types';

// GET: Fetch AI Chat Settings
export async function GET() {
  try {
    const settings = await getAiChatSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('[Admin AI Bot GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve AI bot settings.' },
      { status: 500 }
    );
  }
}

// POST: Save settings OR test Groq API key
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || 'save_settings';

    // Action 1: Test Groq API Key
    if (action === 'test_groq') {
      const apiKey = (body.groqApiKey || '').trim();
      const model = (body.model || 'llama-3.3-70b-versatile').trim();

      if (!apiKey) {
        return NextResponse.json(
          {
            success: false,
            error: 'Please enter a valid Groq API key (starts with "gsk_...").',
          },
          { status: 400 }
        );
      }

      const startTime = Date.now();

      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are a testing assistant for FCC Global Education. Respond with a short 1-sentence confirmation.',
              },
              {
                role: 'user',
                content: 'Confirm connection test status.',
              },
            ],
            temperature: 0.2,
            max_tokens: 60,
          }),
        });

        const latencyMs = Date.now() - startTime;
        const resData = await groqResponse.json();

        if (!groqResponse.ok) {
          const errMsg = resData.error?.message || `Groq API responded with status ${groqResponse.status}`;
          return NextResponse.json(
            {
              success: false,
              error: errMsg,
              latencyMs,
            },
            { status: 400 }
          );
        }

        const reply = resData.choices?.[0]?.message?.content || 'Connection OK';

        return NextResponse.json({
          success: true,
          message: 'Groq API connection verified successfully!',
          reply,
          latencyMs,
          model,
        });
      } catch (networkErr: any) {
        return NextResponse.json(
          {
            success: false,
            error: networkErr?.message || 'Failed to reach Groq API server. Please check internet connection.',
          },
          { status: 500 }
        );
      }
    }

    // Action 2: Save AI Bot Settings
    const data: Partial<AiChatSettings> = body.settings || body;

    const currentSettings = await getAiChatSettings();
    const updatedSettings: AiChatSettings = {
      ...currentSettings,
      enabled: data.enabled !== undefined ? Boolean(data.enabled) : currentSettings.enabled,
      groqApiKey: data.groqApiKey !== undefined ? String(data.groqApiKey).trim() : currentSettings.groqApiKey,
      model: data.model || currentSettings.model || 'llama-3.3-70b-versatile',
      botName: data.botName || currentSettings.botName || 'FCC AI Admissions Counselor',
      botAvatar: data.botAvatar || currentSettings.botAvatar,
      welcomeMessage: data.welcomeMessage || currentSettings.welcomeMessage,
      systemPrompt: data.systemPrompt || currentSettings.systemPrompt,
      suggestedQuestions: Array.isArray(data.suggestedQuestions)
        ? data.suggestedQuestions.filter((q) => q && q.trim())
        : currentSettings.suggestedQuestions,
      temperature: data.temperature !== undefined ? Number(data.temperature) : currentSettings.temperature,
    };

    await db.updateTable('aiChatSettings', updatedSettings);

    return NextResponse.json({
      success: true,
      message: 'AI Chatbot settings successfully updated and live!',
      settings: updatedSettings,
    });
  } catch (error: any) {
    console.error('[Admin AI Bot POST Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update AI bot settings.' },
      { status: 500 }
    );
  }
}
