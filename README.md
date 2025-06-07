# Privykids - Digital Privacy Academy 🛡️

> **Demo**: [privykids.mikascend.xyz](https://privykids.mikascend.xyz)

Platform edukasi privasi digital yang interaktif untuk anak-anak Indonesia usia 8-12 tahun. Belajar keamanan internet melalui game seru, kuis edukatif, dan chatbot AI yang ramah anak.

![Privykids Banner](https://img.shields.io/badge/Privykids-Digital%20Privacy%20Academy-blue?style=for-the-badge&logo=shield)

## 🎯 Fitur Utama

### 🎮 **Game Edukatif Interaktif**
- **Benteng Kata Sandi** - Game menantang untuk membuat password yang kuat dengan 10 aturan progresif
- **Bagikan atau Lindungi** - Game dengan timer untuk melatih keputusan berbagi informasi online
- Audio feedback dan animasi visual yang engaging

### 🧠 **Sistem Kuis Bertingkat**
- **4 Level Misi**: Dasar-Dasar Privasi → Kekuatan Kata Sandi → Detektif Phishing → Keamanan Media Sosial
- Sistem progresif dengan unlocking berdasarkan level
- Feedback instant dengan penjelasan detail
- Passing score yang dapat dikonfigurasi

### 🤖 **AI Assistant "Privacy Pal"**
- Chatbot berbasis Azure OpenAI (GPT-4o-mini)
- Khusus membahas topik keamanan digital
- Bahasa Indonesia yang ramah anak
- Sistem pencegahan off-topic otomatis

### 📊 **Tracking Progress**
- Sistem level dan poin
- Badge collection dan achievements
- Streak tracking
- Cloud storage dengan fallback localStorage

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** 
- **Tailwind CSS** untuk styling
- **Lucide React** untuk icons
- **Vite** sebagai build tool

### Backend & Cloud
- **Azure Cosmos DB** untuk penyimpanan data
- **Azure OpenAI** untuk AI assistant
- **Vercel** untuk hosting dan serverless functions

### Audio
- **Web Audio API** untuk sound effects dinamis
- Sistem audio procedural tanpa file eksternal

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Azure account (untuk cloud features)
- Vercel account (untuk deployment)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd privykids

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan konfigurasi Azure Anda
```

### Environment Variables

```env
# Azure Cosmos DB
VITE_COSMOS_DB_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
VITE_COSMOS_DB_KEY=your-cosmos-db-primary-key
VITE_COSMOS_DB_DATABASE_ID=privykids-database

# Azure OpenAI
VITE_AZURE_OPENAI_ENDPOINT=https://your-openai-resource.openai.azure.com/
VITE_AZURE_OPENAI_API_KEY=your-openai-api-key
VITE_AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini-privykid
VITE_AZURE_OPENAI_API_VERSION=2024-08-01-preview
```

### Development

```bash
# Local development (frontend only)
npm run dev

# Full development dengan Vercel serverless functions
npm install -g vercel
vercel dev
```

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

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
