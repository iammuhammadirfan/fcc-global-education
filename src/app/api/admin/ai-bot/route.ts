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
      let model = (body.model || 'llama-3.1-8b-instant').trim();

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

      // Query available models for this specific Groq key
      let availableModels: string[] = [];
      try {
        const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (modelsRes.ok) {
          const mData = await modelsRes.json();
          if (Array.isArray(mData?.data)) {
            availableModels = mData.data.map((m: any) => m.id);
          }
        }
      } catch {
        // network or auth error will be caught during completion
      }

      try {
        let testModel = model;
        let autoSwitched = false;

        // If requested model is clearly not in availableModels, auto-pick best available
        if (availableModels.length > 0 && !availableModels.includes(testModel)) {
          const fallback =
            availableModels.find((m) => m === 'llama-3.1-8b-instant') ||
            availableModels.find((m) => m.includes('8b')) ||
            availableModels.find((m) => m.startsWith('llama')) ||
            availableModels[0];
          if (fallback) {
            testModel = fallback;
            autoSwitched = true;
          }
        }

        let groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: testModel,
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

        // If primary attempt failed with model error, retry with universal llama-3.1-8b-instant
        if (!groqResponse.ok && testModel !== 'llama-3.1-8b-instant') {
          const secondResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant',
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
          if (secondResponse.ok) {
            groqResponse = secondResponse;
            testModel = 'llama-3.1-8b-instant';
            autoSwitched = true;
          }
        }

        const latencyMs = Date.now() - startTime;
        const resData = await groqResponse.json();

        if (!groqResponse.ok) {
          const errMsg = resData.error?.message || `Groq API responded with status ${groqResponse.status}`;
          return NextResponse.json(
            {
              success: false,
              error: errMsg,
              latencyMs,
              availableModels,
            },
            { status: 400 }
          );
        }

        const reply = resData.choices?.[0]?.message?.content || 'Connection OK';

        return NextResponse.json({
          success: true,
          message: autoSwitched
            ? `Groq API verified! Auto-switched to '${testModel}' (fully supported by your Groq key).`
            : `Groq API connection verified successfully with model '${testModel}'!`,
          reply,
          latencyMs,
          model: testModel,
          autoSwitched,
          availableModels,
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
      model: data.model || currentSettings.model || 'llama-3.1-8b-instant',
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
