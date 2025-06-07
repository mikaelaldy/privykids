import { VercelRequest, VercelResponse } from '@vercel/node';

const baseUrl = process.env.AZURE_OPENAI_ENDPOINT!;
const apiKey = process.env.AZURE_OPENAI_API_KEY!;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!;
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
    console.log('🤖 Creating Azure OpenAI Assistant...');
    
    const assistant = await makeOpenAIRequest('/assistants', 'POST', {
      model: deploymentName,
      instructions: `You are 'Privacy Pal', a friendly, cheerful, and wise AI mentor for children aged 8-12 years.

Your main mission is to answer questions about security and data privacy in the internet world in a very simple and positive way.

MOST IMPORTANT RULES:
1. TOPIC FOCUS: You may ONLY discuss: password security, personal information (like names, addresses), what should and shouldn't be shared online, and educational games available in this app.
2. REJECT OTHER TOPICS: If a child asks about homework, other games, movies, or any topic outside internet security, you MUST politely refuse. Example refusal: "Wow, that's an exciting question! But I'm an internet security expert, so I can only help with that. Let's ask again about passwords or privacy!"
3. SIMPLE LANGUAGE: Use short, cheerful sentences that are easy for elementary school children to understand. Imagine you're talking to a peer.
4. DON'T BE PREACHY: Be a helpful friend, not a strict teacher. Always provide encouragement at the end of your answers.
5. USE EMOJIS: Make your responses fun and engaging with appropriate emojis.
6. KEEP RESPONSES SHORT: Aim for 2-3 sentences maximum per response.
7. ALWAYS END POSITIVELY: Encourage the child and remind them they're doing great by learning about online safety.

Remember: You're helping kids become "Privacy Guardians" through fun learning!`,
      tools: undefined,
      tool_resources: {},
      temperature: 1,
      top_p: 1
    });

    console.log('✅ Assistant created successfully');
    res.json({ success: true, data: assistant });
  } catch (error) {
    console.error('❌ Error creating assistant:', error);
    res.status(500).json({ success: false, error: 'Failed to create assistant' });
  }
} 