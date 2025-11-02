# Railway Deployment Guide - Assessment Portal

This guide will help you deploy the updated Assessment Portal application to Railway.

## 🔐 **Authentication Changes**

The application now supports **two access types**:

### **1. Full Access (Admin)**
- **Username**: `client`
- **Password**: `secureAccess2025`
- **Features**:
  - ✅ Dashboard access
  - ✅ Submit new questionnaires
  - ✅ View submitted questionnaires
  - ✅ Manage assessments
  - ✅ Full portal access

### **2. Assessment Access (Customer)**
- **Username**: `assessment`
- **Password**: `secureAccess2025`
- **Features**:
  - ✅ Submit new questionnaires ONLY
  - ❌ Cannot view submitted questionnaires
  - ❌ Cannot access assessments
  - ❌ Cannot access dashboard

## 📝 **What's Changed**

1. **Branding Removed**: All "AlphaCloud" and "Naqel" references removed
2. **Copyright Added**: "Developed by Anas Raqi" footer on all pages
3. **Two-Tier Authentication**: Full and Assessment access types
4. **Role-Based UI**: Menu items shown/hidden based on access type
5. **Route Protection**: Assessment users cannot access restricted routes
6. **Generic Client ID**: Changed from 'naqel' to 'default' throughout

## 🚀 **Railway Deployment Steps**

### **Prerequisites**
1. GitHub account
2. Railway account (sign up at https://railway.app)
3. This code pushed to a GitHub repository

### **Step 1: Push to GitHub**

```bash
cd alphacloud-complete

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Generic Assessment Portal with Two-Tier Authentication"

# Add your GitHub repository as remote
git remote add origin <your-github-repo-url>

# Push to GitHub
git branch -M main
git push -u origin main
```

### **Step 2: Deploy on Railway**

1. **Log in to Railway**
   - Go to https://railway.app
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Deployment**
   Railway will auto-detect the configuration from `railway.json` and `nixpacks.toml`
   
   If needed, verify these settings:
   - **Build Command**: `pnpm install --prefer-offline && pnpm run build`
   - **Start Command**: `npx serve dist -s -p $PORT`
   - **Root Directory**: `/`

4. **Environment Variables**
   Add these environment variables in Railway dashboard:
   
   ```
   VITE_SUPABASE_URL=https://dasayklxuitycwesuzmc.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc2F5a2x4dWl0eWN3ZXN1em1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTg0MjUsImV4cCI6MjA3NTk3NDQyNX0.MpQkAN28Re4EYTr_1rnxwt86z81rvzS1rVYiKpHGKfw
   ```

5. **Deploy**
   - Click "Deploy"
   - Railway will build and deploy your application
   - Wait for deployment to complete (usually 2-5 minutes)

6. **Get Your URL**
   - Once deployed, Railway will provide a public URL
   - Example: `https://your-app.up.railway.app`

### **Step 3: Update Supabase Edge Functions**

The edge functions need to be updated to use 'default' instead of 'naqel' as client_id.

**Option 1: Already Updated in /workspace/supabase/functions/**
The edge functions in this workspace have been updated. You can deploy them using:

```bash
# If you have Supabase CLI installed
supabase functions deploy auth-login
supabase functions deploy questionnaire
supabase functions deploy assessment
supabase functions deploy file-upload
supabase functions deploy pdf-export
supabase functions deploy submitted-assessments
```

**Option 2: Manual Update**
If the edge functions weren't deployed, update the following files in your Supabase dashboard:
- auth-login: Update to support both 'client' and 'assessment' users
- All other functions: Change `client_id: 'naqel'` to `client_id: 'default'`

## 🧪 **Testing After Deployment**

### **Test Full Access**
1. Go to your Railway URL
2. Select "Full Access"
3. Enter password: `secureAccess2025`
4. Verify you can access:
   - Dashboard
   - New Questionnaire
   - Submitted Questionnaires

### **Test Assessment Access**
1. Log out
2. Select "Assessment Access"
3. Enter password: `secureAccess2025`
4. Verify:
   - ✅ Can submit new questionnaires
   - ❌ Cannot access Dashboard (auto-redirected to questionnaire)
   - ❌ Cannot access Submitted (no menu option)

## 📊 **Railway Configuration Files**

### **railway.json**
Defines build and deployment configuration for Railway.

### **nixpacks.toml**
Specifies build dependencies and commands for Nixpacks builder.

### **package.json**
Contains all npm scripts and dependencies. No changes needed.

## 🔧 **Troubleshooting**

### **Build Fails**
- Check Railway build logs
- Verify environment variables are set correctly
- Ensure pnpm-lock.yaml is committed to git

### **Application Doesn't Start**
- Check start command is correct: `npx serve dist -s -p $PORT`
- Verify PORT environment variable is available

### **Supabase Errors**
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Check edge functions are deployed and updated with 'default' client_id

### **Login Issues**
- Verify auth-login edge function is deployed with new authentication logic
- Check browser console for errors
- Verify credentials: 'client' or 'assessment' with password 'secureAccess2025'

## 📝 **Additional Notes**

- **Custom Domain**: You can add a custom domain in Railway dashboard
- **Auto-Deploy**: Railway will auto-deploy on every git push to main branch
- **Monitoring**: Railway provides logs and metrics in the dashboard
- **Scaling**: Railway auto-scales based on traffic

## 📞 **Support**

If you encounter issues:
1. Check Railway deployment logs
2. Check Supabase edge function logs
3. Check browser console for frontend errors

---

**Application Status**: ✅ Ready for Railway Deployment  
**Copyright**: Developed by Anas Raqi
