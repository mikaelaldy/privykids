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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { threadId, runId } = req.query;

  if (!threadId || typeof threadId !== 'string') {
    return res.status(400).json({ success: false, error: 'Thread ID is required' });
  }

  if (!runId || typeof runId !== 'string') {
    return res.status(400).json({ success: false, error: 'Run ID is required' });
  }

  try {
    console.log(`🔍 Checking run status: ${runId} on thread ${threadId}`);
    
    const run = await makeOpenAIRequest(`/threads/${threadId}/runs/${runId}`, 'GET');
    
    console.log(`📋 Run status: ${run.status}`);
    res.json({ success: true, data: run });
  } catch (error) {
    console.error('❌ Error getting run status:', error);
    res.status(500).json({ success: false, error: 'Failed to get run status' });
  }
} 