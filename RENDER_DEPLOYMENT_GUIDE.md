# AlphaCloud Deployment Guide - Render

This guide will help you deploy the AlphaCloud application to Render, a professional cloud hosting platform that provides excellent performance, security, and scalability.

## 🚀 What You'll Get

After deployment, your AlphaCloud application will be hosted at:
- **Primary URL**: `https://your-app-name.onrender.com` (Render will provide a unique subdomain)
- **Custom Domain**: You can add your own custom domain (e.g., `alphacloud.yourcompany.com`)
- **HTTPS**: Automatic SSL certificate with secure HTTPS
- **Global CDN**: Fast loading times worldwide
- **Free Tier**: Includes generous free usage limits

## 📋 Prerequisites

1. **GitHub Account**: Your code should be pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com) (free tier available)
3. **Git Repository**: Ensure your AlphaCloud code is in a Git repository

## 🛠️ Configuration Already Prepared

I've prepared all the necessary configuration files for your deployment:

### ✅ Files Created:

1. **`render.yaml`** - Main deployment configuration
2. **`render-build.sh`** - Custom build script with environment variables
3. **Updated environment variables** - Supabase configuration uses Vite environment variables

### ✅ Configuration Features:

- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist` (Vite's output directory)
- **Client-Side Routing**: React Router support with rewrite rules
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Caching**: Optimized caching for assets
- **Environment Variables**: Supabase URL and Anon Key configured
- **Build Optimization**: Only rebuilds when source files change

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your GitHub account (recommended)

### Step 3: Deploy Your Application

1. **Create New Static Site**:
   - Click "New +" in your Render dashboard
   - Select "Static Site"

2. **Connect Your Repository**:
   - Choose "Build and deploy from a Git repository"
   - Click "Connect GitHub"
   - Find and select your AlphaCloud repository
   - Grant Render access if prompted

3. **Configure Deployment**:
   - **Service Name**: Enter `alphacloud-complete` (or your preferred name)
   - **Region**: Choose the region closest to your users
   - **Branch**: Leave as `main` (or your default branch)

4. **Configuration (Auto-detected from render.yaml)**:
   - **Build Command**: Will auto-populate from `render-build.sh`
   - **Publish Directory**: Will auto-populate to `dist`
   - **Environment Variables**: Will auto-populate from `render.yaml`

5. **Deploy**:
   - Click "Create Static Site"
   - Render will start building your application

### Step 4: Monitor Deployment

1. **Build Process**:
   - Click on your service in the Render dashboard
   - Watch the real-time build logs
   - Build typically takes 2-5 minutes for the first deployment

2. **Successful Deployment**:
   - You'll see a green "Live" status
   - Your app will be available at the provided URL
   - The URL will look like: `https://alphacloud-complete.onrender.com`

### Step 5: Test Your Deployment

1. **Visit your application**:
   - Open the provided URL in your browser
   - Verify all features work correctly:
     - ✅ Login functionality
     - ✅ Questionnaire completion
     - ✅ File uploads
     - ✅ PDF generation
     - ✅ Submitted questionnaires display

2. **Test key features**:
   - Fill out and submit a questionnaire
   - Upload some test files
   - Download attachments
   - Generate PDF reports

## 🔧 Environment Variables

Your application uses the following environment variables (already configured):

- **`VITE_SUPABASE_URL`**: Your Supabase project URL
- **`VITE_SUPABASE_ANON_KEY`**: Your Supabase anonymous key

These are securely stored in Render and automatically injected during the build process.

## 🌐 Custom Domain (Optional)

To use your own domain:

1. In your Render service dashboard, go to "Settings" tab
2. Scroll to "Custom Domains"
3. Add your custom domain (e.g., `alphacloud.yourcompany.com`)
4. Follow Render's DNS configuration instructions
5. SSL certificate will be automatically provisioned

## 📊 Performance Features

Your deployed application includes:

- **Global CDN**: Fast loading worldwide
- **Automatic HTTPS**: Secure connections
- **Brotli Compression**: Smaller file sizes
- **HTTP/2 Support**: Modern protocol
- **DDoS Protection**: Built-in security
- **Zero-downtime Deploys**: Updates without downtime

## 🔍 Monitoring and Logs

1. **Access Logs**: Check real-time logs in Render dashboard
2. **Performance Metrics**: Monitor bandwidth and build times
3. **Error Tracking**: View build and runtime errors
4. **Health Checks**: Automatic uptime monitoring

## 🚨 Troubleshooting

### Common Issues:

**Build Fails**:
- Check build logs for specific error messages
- Ensure all dependencies are correctly listed in `package.json`
- Verify environment variables are set correctly

**Application Not Loading**:
- Check if the publish directory is correctly set to `dist`
- Verify build completed successfully
- Check browser console for JavaScript errors

**Environment Variables Not Working**:
- Ensure variables are prefixed with `VITE_` in the code
- Verify variables are set in Render dashboard
- Check build logs for environment variable values

**404 Errors for Routes**:
- Ensure rewrite rule is configured: `/*` → `/index.html`
- This handles React Router client-side routing

### Getting Help:

1. **Render Documentation**: [render.com/docs](https://render.com/docs)
2. **Build Logs**: Check real-time logs in Render dashboard
3. **Support**: Render provides excellent community support

## 💰 Pricing

- **Free Tier**: Perfect for development and small-scale use
  - 750 build minutes per month
  - 100GB bandwidth per month
  - Unlimited deployments
- **Paid Plans**: Start at $7/month for enhanced resources

## 🎉 Success!

Once deployed, you'll have:
- Professional hosting with global CDN
- Automatic SSL certificates
- Easy scaling and management
- Professional URL or custom domain
- Zero-downtime deployments
- Excellent performance and reliability

Your AlphaCloud application will be live and accessible worldwide! 🌍

---

## 📞 Next Steps

After successful deployment:

1. **Test all features** thoroughly
2. **Set up monitoring** if needed
3. **Configure custom domain** (optional)
4. **Share your professional URL** with stakeholders

The deployment is production-ready and includes all the features from your current setup, plus the benefits of professional hosting! ✨
