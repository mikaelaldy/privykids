import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CosmosClient } from '@azure/cosmos';

// Initialize Cosmos client
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT!,
  key: process.env.COSMOS_DB_KEY!
});

const database = cosmosClient.database(process.env.COSMOS_DB_DATABASE_NAME || 'privykids');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Ensure container exists
    const { container } = await database.containers.createIfNotExists({
      id: 'user-progress',
      partitionKey: '/userId'
    });

    switch (req.method) {
      case 'GET':
        try {
          const { resource } = await container.item(userId, userId).read();
          return res.status(200).json(resource || {
            id: userId,
            userId,
            completedLevels: [],
            totalScore: 0,
            currentLevel: 1,
            badges: [],
            lastActivity: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (error: any) {
          if (error.code === 404) {
            return res.status(200).json({
              id: userId,
              userId,
              completedLevels: [],
              totalScore: 0,
              currentLevel: 1,
              badges: [],
              lastActivity: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
          throw error;
        }

      case 'POST':
      case 'PUT':
        const progressData = {
          ...req.body,
          id: userId,
          userId,
          updatedAt: new Date().toISOString()
        };

        if (!progressData.createdAt) {
          progressData.createdAt = new Date().toISOString();
        }

        const { resource } = await container.items.upsert(progressData);
        return res.status(200).json(resource);

      case 'DELETE':
        await container.item(userId, userId).delete();
        return res.status(200).json({ success: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('❌ Cosmos DB API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 