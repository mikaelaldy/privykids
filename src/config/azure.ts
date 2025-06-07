// Azure Configuration for Hybrid Cloud-First Approach
export interface AzureConfig {
  cosmosDb: {
    endpoint: string;
    key: string;
    databaseId: string;
  };
  openAI: {
    endpoint: string;
    apiKey: string;
    deploymentName: string;
    apiVersion: string;
  };
}

// Environment Variables (VITE_ prefix for client-side access)
const config: AzureConfig = {
  cosmosDb: {
    endpoint: import.meta.env.VITE_COSMOS_DB_ENDPOINT || '',
    key: import.meta.env.VITE_COSMOS_DB_KEY || '',
    databaseId: import.meta.env.VITE_COSMOS_DB_DATABASE_ID || 'privykids-database',
  },
  openAI: {
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',
    deploymentName: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini-privykid',
    apiVersion: import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '2024-08-01-preview',
  },
};

// Configuration validation
export const isCosmosDbConfigured = !!(
  config.cosmosDb.endpoint && 
  config.cosmosDb.key
);

export const isOpenAIConfigured = !!(
  config.openAI.endpoint && 
  config.openAI.apiKey && 
  config.openAI.deploymentName
);

// Logging function
export const logConfigStatus = () => {
  console.log('🔧 Azure Configuration Status');
  console.log('Environment:', import.meta.env.MODE);
  console.log('Cosmos DB Available:', isCosmosDbConfigured ? '✅' : '❌');
  console.log('OpenAI Available:', isOpenAIConfigured ? '✅' : '❌');
  console.log('Storage Strategy: Cloud-first with localStorage fallback');
  console.log('OpenAI Model:', config.openAI.deploymentName);
  console.log('API Version:', config.openAI.apiVersion);

  if (!isCosmosDbConfigured) {
    console.warn('❌ Cosmos DB not configured, using localStorage fallback');
    console.warn('Missing:', 
      !config.cosmosDb.endpoint ? 'VITE_COSMOS_DB_ENDPOINT' : '', 
      !config.cosmosDb.key ? 'VITE_COSMOS_DB_KEY' : ''
    );
  } else {
    console.log('✅ Cosmos DB configured for hybrid cloud storage');
  }

  if (!isOpenAIConfigured) {
    console.warn('❌ Azure OpenAI not configured, using fallback responses');
    console.warn('Missing:', 
      !config.openAI.endpoint ? 'VITE_AZURE_OPENAI_ENDPOINT' : '', 
      !config.openAI.apiKey ? 'VITE_AZURE_OPENAI_API_KEY' : '',
      !config.openAI.deploymentName ? 'VITE_AZURE_OPENAI_DEPLOYMENT_NAME' : ''
    );
  } else {
    console.log('✅ Azure OpenAI configured for direct client access');
  }

  return {
    cosmosDbAvailable: isCosmosDbConfigured,
    openAIAvailable: isOpenAIConfigured,
    environment: import.meta.env.MODE
  };
};

export default config; 