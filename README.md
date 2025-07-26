# 🚀 Code Submission Platform

A modern web application built with **Vue 3**, **Nuxt 3**, **Pinia**, **Firebase**, and **TailwindCSS** that allows users to submit programming solutions and enables administrators to manage submissions and users.

![Platform Preview](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop)

## ✨ Features

### 🧑 **Visitor Features**
- **Google Sign-In Integration** - Secure authentication via Firebase Auth
- **Guest Access** - Try the platform without creating an account
- **Code Editor** - Clean interface for writing and submitting code solutions
- **Programming Challenges** - Solve coding problems like "Print first 100 prime numbers"
- **Submission History** - View your previous code submissions
- **Real-time Updates** - See submissions update instantly

### 🛠️ **Admin Features**
- **Admin Dashboard** - Comprehensive management interface
- **View All Submissions** - Monitor all user submissions with code preview
- **User Management** - Add/remove admin privileges
- **Protected Routes** - Role-based access control
- **Real-time Monitoring** - Live updates of platform activity

### 🔥 **Technical Features**
- **Vue 3 Composition API** - Modern Vue.js patterns
- **Pinia State Management** - Centralized state with TypeScript support
- **Firebase Integration** - Authentication, Firestore database, real-time updates
- **Responsive Design** - Works seamlessly on desktop and mobile
- **TypeScript Support** - Type-safe development experience
- **TailwindCSS** - Modern, utility-first styling

## 🏗️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Vue 3** | Frontend Framework | ^3.3.0 |
| **Nuxt 3** | Full-stack Framework | ^3.8.0 |
| **Pinia** | State Management | ^2.1.0 |
| **Firebase** | Backend Services | ^10.5.0 |
| **TailwindCSS** | Styling | ^3.3.0 |
| **TypeScript** | Type Safety | ^5.2.0 |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Firebase Account**
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/code-submission-platform.git
cd code-submission-platform
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Google provider)
   - Create Firestore database

2. **Get Firebase Config**
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy configuration values

3. **Set up Environment Variables**

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Admin Configuration
ADMIN_EMAILS=admin@yourdomain.com,another-admin@yourdomain.com
```

### 4. Configure Firestore Security Rules

In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write submissions
    match /submissions/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Admin management
    match /admins/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
  }
}
```

### 5. Set Up First Admin

In Firestore Console, create a collection called `admins`:

1. Collection ID: `admins`
2. Document ID: `your-email@domain.com`
3. Fields:
   - `email`: `your-email@domain.com` (string)
   - `addedAt`: Current timestamp
   - `isAdmin`: `true` (boolean)

### 6. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` 🎉

## 📁 Project Structure

```
code-submission-platform/
├── 📁 components/           # Vue components
│   ├── AdminDashboard.vue   # Admin interface
│   ├── VisitorDashboard.vue # User interface
│   └── DebugFirebase.vue    # Debug component
├── 📁 stores/               # Pinia stores
│   ├── auth.ts              # Authentication store
│   ├── submissions.ts       # Submissions management
│   └── admin.ts             # Admin management
├── 📁 plugins/              # Nuxt plugins
│   └── firebase.client.ts   # Firebase initialization
├── 📁 pages/                # Nuxt pages
│   └── index.vue            # Main application page
├── 📁 assets/               # Static assets
│   └── css/main.css         # Global styles
├── 📄 app.vue               # Root component
├── 📄 nuxt.config.ts        # Nuxt configuration
├── 📄 .env                  # Environment variables
└── 📄 package.json          # Dependencies
```

## 🔧 Configuration

### Nuxt Configuration (`nuxt.config.ts`)

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  ssr: false, // Required for Firebase client-side auth
  runtimeConfig: {
    adminEmails: process.env.ADMIN_EMAILS,
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      // ... other Firebase config
    }
  }
})
```

### Firebase Integration

The platform uses Firebase for:
- **Authentication**: Google OAuth integration
- **Firestore**: Real-time database for submissions and admin data
- **Security**: Role-based access control

## 🎯 Usage Guide

### For Visitors

1. **Access the Platform**
   - Choose "Sign in with Google" for full features
   - Or "Continue as Visitor" for quick access

2. **Submit Code**
   - Read the programming challenge
   - Write your solution in the code editor
   - Click "Submit Solution"
   - View your submission history

### For Admins

1. **Access Admin Dashboard**
   - Sign in with Google using an admin email
   - Admin badge will appear in navigation

2. **Manage Submissions**
   - View all user submissions
   - Expand code previews
   - Monitor platform activity

3. **Manage Admins**
   - Add new admin users by email
   - Remove admin privileges
   - View admin activity

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Netlify

```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
# Set environment variables in Netlify dashboard
```

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `ADMIN_EMAILS`

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Adding New Features

1. **New Components**: Add to `components/` directory
2. **State Management**: Extend existing stores or create new ones in `stores/`
3. **Pages**: Add new pages in `pages/` directory
4. **Styling**: Use TailwindCSS classes or extend `assets/css/main.css`

### Database Schema

#### Submissions Collection

```typescript
interface Submission {
  id: string
  userEmail: string
  userName: string
  code: string
  question: string
  submittedAt: Date
}
```

#### Admins Collection

```typescript
interface Admin {
  email: string        // Document ID
  addedAt: Date
  isAdmin: boolean
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Check environment variables
   - Verify Firebase project configuration
   - Ensure Firestore rules are set correctly

2. **Authentication Problems**
   - Verify Google OAuth is enabled in Firebase
   - Check authorized domains in Firebase Auth settings

3. **Submission Not Working**
   - Check browser console for errors
   - Verify user is authenticated
   - Check Firestore security rules

4. **Admin Access Issues**
   - Ensure admin document exists in Firestore
   - Verify email matches exactly
   - Check admin store initialization

### Debug Mode

Enable debug component by adding to your page:

```vue
<DebugFirebase v-if="authStore.user" />
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Write meaningful commit messages
- Test features thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing framework
- **Nuxt Team** - For the powerful full-stack framework
- **Firebase Team** - For the backend services
- **TailwindCSS** - For the utility-first CSS framework
- **Pinia Team** - For the intuitive state management

## 📞 Support

- **Documentation**: [Vue 3 Docs](https://vuejs.org/), [Nuxt 3 Docs](https://nuxt.com/), [Firebase Docs](https://firebase.google.com/docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/code-submission-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/code-submission-platform/discussions)

---

**Built with ❤️ using Vue 3, Nuxt 3, and Firebase**

*Happy Coding! 🚀*
```

This README provides:

- **Complete setup instructions** with step-by-step guidance
- **Feature overview** for both visitors and admins
- **Technical documentation** including project structure
- **Deployment guides** for popular platforms
- **Troubleshooting section** for common issues
- **Contributing guidelines** for open source collaboration
- **Professional formatting** with emojis and clear sections

The README is comprehensive yet easy to follow, making it simple for developers to understand, set up, and contribute to your project!

