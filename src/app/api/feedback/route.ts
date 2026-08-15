import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { notePath, feedbackType, message } = await request.json();

    if (!notePath || !message || !feedbackType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = {
      embeds: [{
        title: `📝 New Feedback: ${feedbackType}`,
        color: 0x10b981, // Emerald Green
        timestamp: new Date().toISOString(),
        fields: [
          { name: 'Note Path', value: `\`${notePath}\``, inline: true },
          { name: 'Category', value: feedbackType, inline: true },
          { name: 'Message', value: message }
        ]
      }]
    };

    const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK_URL;

    if (webhookUrl) {
      // Send message to Discord Webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Discord Webhook returned status code ${response.status}`);
      }
    } else {
      // If no webhook configured, log to a local file in development for testing
      console.log('--- LOCAL FEEDBACK CAPTURED (No Discord Webhook URL configured) ---');
      console.log(JSON.stringify(payload, null, 2));
      console.log('------------------------------------------------------------------');

      const logDir = path.resolve('./logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      const logFilePath = path.join(logDir, 'feedback.log');
      const logMessage = `[${new Date().toISOString()}] Note: ${notePath} | Category: ${feedbackType} | Msg: ${message}\n`;
      fs.appendFileSync(logFilePath, logMessage, 'utf-8');
    }

    return NextResponse.json({ success: true, message: 'Feedback logged successfully' });
  } catch (error: any) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
