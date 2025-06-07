// Azure Configuration with validation and environment detection
export interface AzureConfig {
  cosmosDb: {
    endpoint: string;
    key: string;
    databaseId: string;
    containers: {
      userProgress: string;
      achievements: string;
      chatHistory: string;
    };
  };
  openAI: {
    endpoint: string;
    apiKey: string;
    deploymentName: string;
    apiVersion: string;
  };
  app: {
    environment: 'development' | 'production' | 'staging';
    enableOfflineFallback: boolean;
    maxRetries: number;
    timeoutMs: number;
  };
}

export const AZURE_CONFIG: AzureConfig = {
  cosmosDb: {
    endpoint: import.meta.env.VITE_COSMOS_DB_ENDPOINT || '',
    key: import.meta.env.VITE_COSMOS_DB_KEY || '',
    databaseId: import.meta.env.VITE_COSMOS_DB_DATABASE_ID || 'privykids-database',
    containers: {
      userProgress: 'user-progress',
      achievements: 'achievements',
      chatHistory: 'chat-history'
    }
  },
  openAI: {
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',
    deploymentName: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini-privykid',
    apiVersion: '2024-05-01-preview'
  },
  app: {
    environment: (import.meta.env.VITE_APP_ENVIRONMENT as any) || 'development',
    enableOfflineFallback: import.meta.env.VITE_ENABLE_OFFLINE_FALLBACK === 'true',
    maxRetries: 3,
    timeoutMs: 30000
  }
};

export interface ConfigValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
  canUseCosmosDb: boolean;
  canUseOpenAI: boolean;
}

export const validateAzureConfig = (): ConfigValidationResult => {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required Cosmos DB configuration
  if (!AZURE_CONFIG.cosmosDb.endpoint) missing.push('VITE_COSMOS_DB_ENDPOINT');
  if (!AZURE_CONFIG.cosmosDb.key) missing.push('VITE_COSMOS_DB_KEY');
  if (!AZURE_CONFIG.cosmosDb.databaseId) missing.push('VITE_COSMOS_DB_DATABASE_ID');

  // Check OpenAI configuration
  if (!AZURE_CONFIG.openAI.endpoint) missing.push('VITE_AZURE_OPENAI_ENDPOINT');
  if (!AZURE_CONFIG.openAI.apiKey) missing.push('VITE_AZURE_OPENAI_API_KEY');

  // Add warnings for optional configurations
  if (!AZURE_CONFIG.openAI.deploymentName) {
    warnings.push('Using default OpenAI deployment name: gpt-4o-mini-privykid');
  }

  const canUseCosmosDb = AZURE_CONFIG.cosmosDb.endpoint && AZURE_CONFIG.cosmosDb.key;
  const canUseOpenAI = AZURE_CONFIG.openAI.endpoint && AZURE_CONFIG.openAI.apiKey;

  const isValid = missing.length === 0;

  if (missing.length > 0) {
    console.warn('🚨 Missing Azure configuration:', missing.join(', '));
    if (AZURE_CONFIG.app.enableOfflineFallback) {
      console.info('📱 Offline mode enabled - app will use localStorage fallback');
    }
  }

  if (warnings.length > 0) {
    console.warn('⚠️ Azure configuration warnings:', warnings.join(', '));
  }

  return {
    isValid,
    missing,
    warnings,
    canUseCosmosDb,
    canUseOpenAI
  };
};

export const logConfigStatus = () => {
  const validation = validateAzureConfig();
  
  console.group('🔧 Azure Configuration Status');
  console.log('Environment:', AZURE_CONFIG.app.environment);
  console.log('Cosmos DB Available:', validation.canUseCosmosDb ? '✅' : '❌');
  console.log('OpenAI Available:', validation.canUseOpenAI ? '✅' : '❌');
  console.log('Offline Fallback:', AZURE_CONFIG.app.enableOfflineFallback ? '✅' : '❌');
  console.log('OpenAI Model:', AZURE_CONFIG.openAI.deploymentName);
  console.log('API Version:', AZURE_CONFIG.openAI.apiVersion);
  
  if (validation.missing.length > 0) {
    console.warn('Missing Config:', validation.missing);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('Warnings:', validation.warnings);
  }
  
  console.groupEnd();
  
  return validation;
}; 