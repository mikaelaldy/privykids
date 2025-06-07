import { CosmosClient, Container, Database } from '@azure/cosmos';
import config, { isCosmosDbConfigured } from '../config/azure';

const endpoint = config.cosmosDb.endpoint;
const key = config.cosmosDb.key;
const databaseId = config.cosmosDb.databaseId;

console.log('🔍 Cosmos DB Configuration Debug:');
console.log('Endpoint:', endpoint);
console.log('Key present:', !!key);
console.log('Key length:', key ? key.length : 0);
console.log('Database ID:', databaseId);

if (!isCosmosDbConfigured) {
  console.warn('❌ Cosmos DB not configured, using localStorage fallback');
  console.warn('Missing:', !endpoint ? 'ENDPOINT' : '', !key ? 'KEY' : '');
} else {
  console.log('✅ Cosmos DB configured');
}

// Initialize Cosmos Client only if configured
const client = isCosmosDbConfigured ? new CosmosClient({ endpoint, key }) : null;

// Get or create database
export const getDatabase = async (): Promise<Database | null> => {
  if (!client) {
    console.log('❌ Cosmos DB client not available');
    return null;
  }
  
  try {
    console.log('🔄 Creating/connecting to database:', databaseId);
    const { database } = await client.databases.createIfNotExists({ 
      id: databaseId
    });
    console.log('✅ Database operation successful');
    return database;
  } catch (error: any) {
    console.error('❌ Database operation failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.code);
    if (error.body) {
      console.error('Error body:', error.body);
    }
    console.error('Full error object:', error);
    return null;
  }
};

// Get or create container
export const getContainer = async (containerId: string): Promise<Container | null> => {
  if (!client) {
    console.log('❌ Cosmos DB client not available for container:', containerId);
    return null;
  }

  try {
    console.log('🔄 Creating/connecting to container:', containerId);
    const database = await getDatabase();
    if (!database) {
      console.log('❌ Database not available, cannot create container');
      return null;
    }
    
    const { container } = await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: { paths: ['/userId'] }
    });
    console.log('✅ Container operation successful:', containerId);
    return container;
  } catch (error: any) {
    console.error('❌ Container operation failed for:', containerId);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.code);
    if (error.body) {
      console.error('Error body:', error.body);
    }
    console.error('Full error object:', error);
    return null;
  }
};

// Generate or get user ID (stored in localStorage for anonymity but persistent sessions)
export const getUserId = (): string => {
  let userId = localStorage.getItem('privykids-user-id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('privykids-user-id', userId);
    console.log('✅ Generated new user ID:', userId);
  }
  return userId;
};

// Test Cosmos DB connection
export const testCosmosDBConnection = async (): Promise<boolean> => {
  if (!isCosmosDbConfigured) {
    console.log('❌ Cosmos DB not configured');
    return false;
  }

  try {
    const database = await getDatabase();
    if (database) {
      console.log('✅ Cosmos DB connection test successful');
      return true;
    } else {
      console.log('❌ Cosmos DB connection test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Cosmos DB connection test failed:', error);
    return false;
  }
};

// Check if Cosmos DB is available
export const isCosmosDBAvailable = async (): Promise<boolean> => {
  try {
    const container = await getContainer('test');
    return container !== null;
  } catch {
    return false;
  }
}; 