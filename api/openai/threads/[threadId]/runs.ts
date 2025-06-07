import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { threadId } = req.query;

  if (!threadId || typeof threadId !== 'string') {
    return res.status(400).json({ error: 'Thread ID is required' });
  }

  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-05-01-preview';

    if (!endpoint || !apiKey) {
      return res.status(500).json({ error: 'OpenAI configuration missing' });
    }

    if (req.method === 'POST') {
      // Create a run
      const response = await fetch(`${endpoint}/openai/threads/${threadId}/runs?api-version=${apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify(req.body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenAI API Error:', errorText);
        return res.status(response.status).json({ 
          error: 'Failed to create run',
          details: errorText
        });
      }

      const run = await response.json();
      return res.status(200).json(run);

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('❌ Thread runs error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 