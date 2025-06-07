# Privykids - Digital Privacy Academy 🛡️

A fun, interactive web application designed to teach children (ages 8-12) about digital privacy and online safety through games, quizzes, and an AI chatbot companion.

## 🚀 Features

- **Interactive Quizzes** - Learn privacy fundamentals through engaging questions
- **Mini Games** - Password Fortress and Share or Shield games
- **AI Chatbot** - Privacy Pal, powered by Azure OpenAI Assistant API
- **Progress Tracking** - Level up system with badges and achievements
- **Cloud Storage** - Azure Cosmos DB for user progress with localStorage fallback

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Database**: Azure Cosmos DB
- **AI**: Azure OpenAI (GPT-4o-mini)
- **Hosting**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- Azure Cosmos DB account
- Azure OpenAI service
- Vercel account (for deployment)

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
# Azure Cosmos DB Configuration
VITE_COSMOS_DB_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
VITE_COSMOS_DB_KEY=your-cosmos-db-primary-key
VITE_COSMOS_DB_DATABASE_ID=privykids-database

# Azure OpenAI Configuration  
VITE_AZURE_OPENAI_ENDPOINT=https://your-openai-resource.openai.azure.com/
VITE_AZURE_OPENAI_API_KEY=your-openai-api-key
VITE_AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini-privykid

# Optional Settings
VITE_APP_ENVIRONMENT=development
```

## 🚀 Development

### Option 1: Local Development (Frontend Only)
```bash
npm install
npm run dev
```
*Note: API routes won't work locally - app will use localStorage fallbacks*

### Option 2: Full Development with API Routes
```bash
npm install
npm install -g vercel
vercel login
vercel link
vercel dev
```

## 🏗️ Database Setup

1. Create an Azure Cosmos DB account
2. Create a database named `privykids-database`
3. Containers will be auto-created:
   - `user-progress` (partition key: `/userId`)
   - `achievements` (partition key: `/userId`)  
   - `chat-history` (partition key: `/userId`)

## 🤖 AI Assistant Setup

1. Create an Azure OpenAI resource
2. Deploy a model (recommended: `gpt-4o-mini`)
3. Update the deployment name in environment variables
4. The assistant will be auto-created with privacy-focused instructions

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

```bash
# Manual deployment
vercel --prod
```

## 🎮 Usage

1. **Landing Page** - Welcome and adventure start
2. **Dashboard** - Overview of progress and achievements  
3. **Quizzes** - Privacy knowledge questions
4. **Games** - Interactive learning games
5. **Chatbot** - Chat with Privacy Pal AI assistant

## 🏆 Features

### User Progress System
- Level progression (1-10)
- Point accumulation
- Badge collection
- Streak tracking
- Achievement unlocking

### Educational Content
- Password security best practices
- Personal information protection
- Social media safety
- Online stranger awareness
- Digital footprint consciousness

### AI Assistant (Privacy Pal)
- Child-friendly responses
- Privacy-focused conversations only
- Emoji-rich interactions
- Encouraging and positive tone
- Refuses off-topic questions

## 🔒 Security & Privacy

- **No user accounts required** - Uses anonymous local IDs
- **COPPA compliant** - No personal data collection
- **Secure storage** - All data encrypted in Azure
- **Graceful fallbacks** - Works offline with localStorage
- **Child-safe AI** - Strict content filtering

## 🛠️ API Routes

- `GET/POST /api/cosmos/user-progress/[userId]` - User progress management
- `POST /api/openai/assistant` - Create AI assistant
- `POST /api/openai/threads` - Create conversation threads
- `GET/POST /api/openai/threads/[threadId]/messages` - Message handling
- `POST /api/openai/threads/[threadId]/runs` - Run assistant
- `GET /api/openai/threads/[threadId]/runs/[runId]` - Check run status
- `GET /api/health` - Service health check

## 🐛 Troubleshooting

### Common Issues

1. **"API routes not found" in development**
   - Use `npm run dev:vercel` instead of `npm run dev`
   - Or rely on localStorage fallbacks

2. **CORS errors**
   - Check that environment variables are set correctly
   - Ensure Vercel deployment has proper CORS headers

3. **Assistant not responding**
   - Verify Azure OpenAI deployment name
   - Check API key permissions
   - Monitor Azure OpenAI quota

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## ⭐ Acknowledgments

- Built for children's digital safety education
- Powered by Azure cloud services
- Designed with accessibility and fun in mind
