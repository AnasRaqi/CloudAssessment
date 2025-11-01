# AlphaCloud Portal - Complete Application

AlphaCloud is a comprehensive questionnaire management system built with React, TypeScript, and Vite. It features a modern UI with dark/light theme support, real-time data persistence via Supabase, and professional PDF generation capabilities.

## 🚀 Features

- **Modern React Interface**: Built with React 18, TypeScript, and Tailwind CSS
- **Questionnaire Management**: Complete assessment system with multiple sections (A-J)
- **Real-time Data**: Supabase backend integration for data persistence
- **PDF Export**: Professional PDF generation with attachments
- **Dark/Light Theme**: Complete theme switching support
- **Responsive Design**: Mobile-first responsive interface
- **File Upload**: Assessment attachment management
- **Edge Functions**: Serverless backend functions for data processing
- **Professional UI**: Built with Radix UI components and custom styling

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Radix UI
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **PDF Generation**: Custom PDF export with HTML rendering
- **Package Manager**: pnpm
- **Build Tool**: Vite with TypeScript compilation

## 📦 Deployment Ready

This application is configured for deployment on **Render** with:
- ✅ Automated build configuration (`render.yaml`)
- ✅ Custom build script (`render-build.sh`)
- ✅ Environment variable configuration
- ✅ Security headers and caching
- ✅ Client-side routing support
- ✅ Performance optimizations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Development

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd alphacloud-complete
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm dev
   ```

3. **Open in browser**:
   ```
   http://localhost:5173
   ```

### Production Build

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## 🌐 Deploy on Render

The application is pre-configured for Render deployment:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AlphaCloud Portal"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Connect your GitHub repository to Render
   - Render will auto-detect the `render.yaml` configuration
   - Environment variables are pre-configured
   - Click "Create Web Service"

3. **Access your application**:
   - Render will provide a live URL
   - Application will be available immediately after deployment

For detailed deployment instructions, see [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)

## 📁 Project Structure

```
alphacloud-complete/
├── public/                 # Static assets
│   └── AlphaCloud_Questionnaire_Template.pdf
├── src/
│   ├── components/         # React components
│   ├── context/           # React contexts (theme, auth)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   │   └── supabase.ts    # Supabase client setup
│   ├── pages/             # React pages/routes
│   ├── services/          # API services and utilities
│   │   └── pdfExport.ts   # PDF generation service
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── render.yaml            # Render deployment configuration
├── render-build.sh        # Custom build script for Render
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── RENDER_DEPLOYMENT_GUIDE.md  # Detailed deployment guide
```

## 🔧 Environment Configuration

### Development Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Render Deployment

Environment variables are pre-configured in `render.yaml`:
- `VITE_SUPABASE_URL`: https://dasayklxuitycwesuzmc.supabase.co
- `VITE_SUPABASE_ANON_KEY`: Pre-configured for the application

## 🎨 Theming

The application includes full dark/light theme support:
- Automatic system preference detection
- Manual theme toggle
- Consistent styling across all components
- Persistent theme selection

## 📊 Features Overview

### Questionnaire System
- **10 Sections**: Comprehensive assessment sections (A-J)
- **Progress Tracking**: Visual progress indicator
- **Auto-save**: Automatic form data saving
- **Validation**: Form validation with error handling
- **Navigation**: Section-by-section navigation

### File Management
- **Upload**: PDF and document upload capability
- **Storage**: Supabase Storage integration
- **Download**: Direct file download from assessments
- **Preview**: File preview functionality

### PDF Generation
- **Professional Reports**: Clean, formatted PDF output
- **Attachments**: Include uploaded files in reports
- **Branding**: AlphaCloud branding and styling
- **Download**: Instant PDF generation and download

## 🏗 Architecture

### Frontend Architecture
- **React 18**: Modern React with hooks and context
- **TypeScript**: Full type safety
- **Component Library**: Radix UI + custom components
- **State Management**: React Context and useState/useEffect
- **Routing**: React Router for client-side routing

### Backend Integration
- **Supabase**: Complete backend-as-a-service
- **Database**: PostgreSQL database with RLS
- **Authentication**: Supabase Auth integration
- **Storage**: File storage and management
- **Edge Functions**: Serverless API functions

### Build System
- **Vite**: Fast build tool with hot reload
- **TypeScript**: Compilation and type checking
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code quality and consistency

## 🚨 Important Notes

1. **Environment Variables**: Ensure proper environment variable setup
2. **Supabase Configuration**: Backend is pre-configured
3. **Build Process**: Custom build script for Render deployment
4. **Dependencies**: Uses pnpm for efficient package management

## 📚 Documentation

- [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [DEPLOYMENT_README.md](./DEPLOYMENT_README.md) - Quick deployment reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the AlphaCloud Portal system.

---

**Built with ❤️ using React, TypeScript, and Supabase**

For support or questions, please refer to the deployment guide or create an issue in the repository.