import { VercelRequest, VercelResponse } from '@vercel/node';

const baseUrl = process.env.AZURE_OPENAI_ENDPOINT!;
const apiKey = process.env.AZURE_OPENAI_API_KEY!;
const apiVersion = '2024-05-01-preview';

async function makeOpenAIRequest(endpoint: string, method: 'GET' | 'POST' = 'POST', body?: any) {
  const url = `${baseUrl}/openai${endpoint}?api-version=${apiVersion}`;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('🧵 Creating new conversation thread...');
    
    const thread = await makeOpenAIRequest('/threads', 'POST', {});
    
    console.log('✅ Thread created successfully:', thread.id);
    res.json({ success: true, data: thread });
  } catch (error) {
    console.error('❌ Error creating thread:', error);
    res.status(500).json({ success: false, error: 'Failed to create thread' });
  }
} 