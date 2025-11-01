# AlphaCloud - Render Deployment Ready

This repository is configured for deployment to Render, a professional cloud hosting platform.

## 🚀 Quick Deploy to Render

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository
2. **Visit Render**: Go to [render.com](https://render.com) and sign up
3. **Create Static Site**: Click "New +" → "Static Site"
4. **Connect Repository**: Select your GitHub repository
5. **Deploy**: Render will automatically detect and use the `render.yaml` configuration

## 📁 Deployment Files

- **`render.yaml`**: Main deployment configuration
- **`render-build.sh`**: Custom build script for environment variables
- **`RENDER_DEPLOYMENT_GUIDE.md`**: Comprehensive deployment guide

## ⚙️ Configuration Highlights

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **Build**: `npm install && npm run build`
- **Output**: `dist/` directory
- **Environment Variables**: 
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## 🎯 Features Deployed

- ✅ User authentication and questionnaire completion
- ✅ File upload and attachment management
- ✅ PDF generation and export
- ✅ Submitted questionnaires display with download links
- ✅ Responsive design with modern UI
- ✅ Client-side routing (React Router)
- ✅ Secure HTTPS with proper headers

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Environment Variables

For local development, create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🌐 Render Features

When deployed to Render, your application gets:

- **Global CDN**: Fast loading worldwide
- **Automatic HTTPS**: Secure connections
- **Zero-downtime Deploys**: Seamless updates
- **Custom Domain Support**: Professional branding
- **Environment Management**: Secure variable handling
- **Build Optimization**: Efficient deployment pipeline

## 📊 Performance

- **Build Time**: ~2-5 minutes
- **Load Time**: <2 seconds globally
- **SSL**: Automatic certificate provisioning
- **Compression**: Brotli + Gzip
- **Protocol**: HTTP/2 enabled

---

For detailed deployment instructions, see `RENDER_DEPLOYMENT_GUIDE.md`.
