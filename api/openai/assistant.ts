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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-05-01-preview';

    if (!endpoint || !apiKey) {
      return res.status(500).json({ error: 'OpenAI configuration missing' });
    }

    const response = await fetch(`${endpoint}/openai/assistants?api-version=${apiVersion}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        name: 'PrivyKids Assistant',
        instructions: `Kamu adalah asisten AI yang ramah dan aman untuk anak-anak bernama PrivyKids Assistant. 

Tugasmu adalah:
1. Mengajarkan tentang keamanan digital dan privasi online dengan cara yang menyenangkan
2. Menjawab pertanyaan dengan bahasa yang mudah dipahami anak-anak
3. Selalu memprioritaskan keselamatan dan memberikan saran yang aman
4. Menggunakan bahasa Indonesia yang ramah dan tidak menakutkan
5. Memberikan contoh-contoh praktis yang relevan dengan kehidupan anak-anak

Aturan penting:
- Jangan pernah meminta informasi pribadi anak
- Selalu dorong anak untuk bertanya pada orang tua/guru jika ragu
- Gunakan bahasa positif dan mendukung
- Fokus pada edukasi keamanan digital

Contoh topik yang bisa kamu ajarkan:
- Cara membuat password yang kuat
- Tips aman bermedia sosial
- Mengenali penipuan online
- Menjaga privasi data pribadi
- Etika bermedia sosial`,
        model: process.env.AZURE_OPENAI_MODEL || 'gpt-4o-mini',
        tools: []
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API Error:', errorText);
      return res.status(response.status).json({ 
        error: 'Failed to create assistant',
        details: errorText
      });
    }

    const assistant = await response.json();
    return res.status(200).json(assistant);

  } catch (error) {
    console.error('❌ Assistant creation error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 