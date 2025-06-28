# Personal Organizer - Voice-First Productivity App

A unified productivity organizer that seamlessly integrates calendar events, tasks, and notes with intelligent voice input powered by Google Gemini AI.

## 🚀 Features

### Core Functionality
- **Unified Dashboard**: Calendar events, tasks, and notes in one interface
- **Voice Intelligence**: Create, edit, and query items using natural language
- **Smart Linking**: Automatic relationship detection between related items
- **Real-time Sync**: Live updates across all connected devices
- **Advanced Search**: Powerful filtering and search capabilities
- **PWA Support**: Install as a native app on mobile devices

### Voice Capabilities
- **Create**: "Schedule coffee with Sarah Tuesday 3pm"
- **Edit**: "Move my dentist appointment to Friday"
- **Bulk Operations**: "Mark all overdue tasks as high priority"
- **Query**: "What do I have after lunch today?"

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with Apple-inspired design
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **AI**: Google Gemini API for natural language processing
- **Voice**: Web Speech API
- **PWA**: Service Worker + Web App Manifest

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Google Gemini API key

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd personal-organizer
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_APP_NAME="Personal Organizer"
VITE_APP_VERSION="1.0.0"
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies
4. Configure authentication settings

### 4. API Keys Setup

#### Supabase
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

#### Google Gemini
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your environment variables

### 5. Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
npm run preview
```

## 🧪 Testing Guide

### Manual Testing Checklist

#### Voice Input Tests
- [ ] **Calendar Event Creation**: "Schedule coffee with Sarah Tuesday 3pm"
- [ ] **Task Creation**: "Add task buy groceries by Friday high priority"
- [ ] **Note Creation**: "Create note meeting ideas for project planning"
- [ ] **Query Operations**: "What do I have today?"
- [ ] **Edit Operations**: "Move my dentist appointment to Friday"
- [ ] **Bulk Operations**: "Cancel all today's meetings"

#### Manual Input Tests
- [ ] Create calendar event using form
- [ ] Create task with all fields
- [ ] Create note with tags
- [ ] Edit existing items
- [ ] Delete items
- [ ] Toggle task completion

#### Integration Tests
- [ ] Item linking functionality
- [ ] Advanced search with filters
- [ ] Real-time sync across tabs
- [ ] Offline functionality
- [ ] PWA installation

### Browser Compatibility

| Browser | Voice Input | PWA Install | Notifications | Status |
|---------|-------------|-------------|---------------|---------|
| Chrome  | ✅ Full     | ✅ Full     | ✅ Full       | ✅ Recommended |
| Safari  | ✅ Limited  | ✅ Share Menu | ⚠️ Limited   | ✅ Supported |
| Firefox | ✅ Full     | ⚠️ Limited  | ✅ Full       | ✅ Supported |
| Edge    | ✅ Full     | ✅ Full     | ✅ Full       | ✅ Supported |

### Device Testing

#### iPhone/iPad (Primary Target)
- [ ] Touch interactions
- [ ] Voice input with microphone permission
- [ ] PWA installation via Safari share menu
- [ ] Orientation changes
- [ ] Offline functionality

#### Android
- [ ] Touch interactions
- [ ] Voice input
- [ ] PWA installation
- [ ] Chrome compatibility

#### Desktop
- [ ] Mouse interactions
- [ ] Keyboard navigation
- [ ] Window resizing
- [ ] Voice input (with microphone)

## 🔍 Troubleshooting

### Voice Input Issues
- **No microphone access**: Check browser permissions
- **Voice not recognized**: Ensure clear speech and quiet environment
- **API errors**: Verify Gemini API key and quota

### Database Issues
- **Connection errors**: Check Supabase URL and keys
- **RLS errors**: Ensure user is authenticated
- **Sync issues**: Check real-time subscription setup

### PWA Issues
- **Install not available**: Ensure HTTPS and manifest.json
- **Offline not working**: Check service worker registration
- **Icons missing**: Verify icon files in public directory

## 📱 PWA Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm installation

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. Confirm installation

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click to install
3. Or use the custom install button when available

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build settings and environment variables
- **Firebase Hosting**: Use Firebase CLI for deployment
- **GitHub Pages**: Build and deploy static files

## 🔐 Security Considerations

- All API keys are client-side (ensure proper rate limiting)
- Supabase RLS policies protect user data
- HTTPS required for PWA and voice features
- No sensitive data stored in localStorage

## 📈 Performance Optimization

- Lazy loading of components
- Image optimization
- Service worker caching
- Real-time subscription management
- Error boundaries for graceful failures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review browser compatibility
3. Verify environment configuration
4. Check Supabase and Gemini API status

---

**Note**: This is an MVP implementation focused on core functionality. Additional features like advanced AI capabilities, team collaboration, and enterprise features can be added in future iterations.
