import { VercelRequest, VercelResponse } from '@vercel/node';

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

  try {
    res.json({ 
      success: true,
      status: 'OK', 
      timestamp: new Date().toISOString(),
      services: {
        cosmos: !!process.env.COSMOS_DB_ENDPOINT,
        openai: !!process.env.AZURE_OPENAI_ENDPOINT
      },
      version: '1.0.0'
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({ success: false, error: 'Health check failed' });
  }
} 