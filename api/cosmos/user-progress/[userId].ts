import { VercelRequest, VercelResponse } from '@vercel/node';
import { CosmosClient } from '@azure/cosmos';
import { v4 as uuidv4 } from 'uuid';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT!,
  key: process.env.COSMOS_DB_KEY!,
});

const databaseId = process.env.COSMOS_DB_DATABASE_ID!;

// Initialize database and containers if needed
async function ensureContainerExists(containerId: string) {
  try {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: { paths: ['/userId'] }
    });
    return database.container(containerId);
  } catch (error) {
    console.error(`❌ Error ensuring container ${containerId}:`, error);
    throw error;
  }
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

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  try {
    const container = await ensureContainerExists('user-progress');

    if (req.method === 'GET') {
      // Get user progress
      const query = `SELECT * FROM c WHERE c.userId = @userId ORDER BY c.updatedAt DESC`;
      const { resources } = await container.items.query({
        query,
        parameters: [{ name: '@userId', value: userId }]
      }).fetchAll();

      if (resources.length > 0) {
        const doc = resources[0];
        res.json({
          success: true,
          data: {
            level: doc.level,
            totalPoints: doc.totalPoints,
            badges: doc.badges,
            completedQuizzes: doc.completedQuizzes,
            completedGames: doc.completedGames,
            streakDays: doc.streakDays
          }
        });
      } else {
        res.json({
          success: true,
          data: {
            level: 1,
            totalPoints: 0,
            badges: [],
            completedQuizzes: [],
            completedGames: [],
            streakDays: 1
          }
        });
      }
    } else if (req.method === 'POST') {
      // Update user progress
      const progress = req.body;
      const now = new Date();

      // Try to find existing document
      const query = `SELECT * FROM c WHERE c.userId = @userId ORDER BY c.updatedAt DESC`;
      const { resources } = await container.items.query({
        query,
        parameters: [{ name: '@userId', value: userId }]
      }).fetchAll();

      if (resources.length > 0) {
        // Update existing document
        const existingDoc = resources[0];
        const updatedDoc = {
          ...existingDoc,
          ...progress,
          updatedAt: now,
          version: existingDoc.version + 1
        };
        
        await container.item(existingDoc.id, userId).replace(updatedDoc);
      } else {
        // Create new document
        const newDoc = {
          id: uuidv4(),
          partitionKey: userId,
          userId,
          ...progress,
          createdAt: now,
          updatedAt: now,
          version: 1,
          lastLoginDate: now,
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'en'
          }
        };
        
        await container.items.create(newDoc);
      }

      console.log(`✅ User progress updated for ${userId}`);
      res.json({ success: true });
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('❌ Error in user progress API:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
} 