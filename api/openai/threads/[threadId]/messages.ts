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

  const { threadId } = req.query;

  if (!threadId || typeof threadId !== 'string') {
    return res.status(400).json({ success: false, error: 'Thread ID is required' });
  }

  try {
    if (req.method === 'GET') {
      // Get thread messages
      console.log(`📬 Getting messages for thread: ${threadId}`);
      const response = await makeOpenAIRequest(`/threads/${threadId}/messages`, 'GET');
      
      console.log(`✅ Retrieved ${response.data?.length || 0} messages`);
      res.json({ success: true, data: response });
    } else if (req.method === 'POST') {
      // Add message to thread
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ success: false, error: 'Message content is required' });
      }

      console.log(`💬 Adding message to thread: ${threadId}`);
      const message = await makeOpenAIRequest(`/threads/${threadId}/messages`, 'POST', {
        role: 'user',
        content: content
      });

      console.log('✅ Message added successfully');
      res.json({ success: true, data: message });
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('❌ Error handling messages:', error);
    res.status(500).json({ success: false, error: 'Failed to handle messages' });
  }
} 