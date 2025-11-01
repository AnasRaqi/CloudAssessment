#!/bin/bash

# 🚀 AlphaCloud GitHub Push Script
# This script initializes git and pushes the complete application to GitHub

echo "🚀 AlphaCloud GitHub Push Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "render.yaml" ]; then
    echo "❌ Error: Please run this script from the alphacloud-complete directory"
    exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed. Please install Git first."
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo "📦 Package files found:"
ls -1 | head -10
echo ""

# Check for GitHub URL
read -p "🔗 Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: Repository URL is required"
    exit 1
fi

echo ""
echo "🔄 Initializing Git repository..."
git init
git branch -M main

echo "📝 Adding all files to Git..."
git add .

echo "💬 Creating initial commit..."
git commit -m "Initial commit - AlphaCloud Portal Complete Application

✨ Features:
- Complete React TypeScript application
- Render deployment configuration  
- Supabase backend integration
- Professional UI with dark/light theme
- Questionnaire management system
- PDF generation and export
- File upload capabilities
- Responsive design

🛠️ Tech Stack:
- React 18 + TypeScript + Vite
- Tailwind CSS + Radix UI
- Supabase (Database, Auth, Storage, Edge Functions)
- pnpm package manager

🚀 Deployment Ready:
- Render configuration included
- Environment variables set up
- Build process optimized
- Documentation complete"

echo "🔗 Adding remote repository..."
git remote add origin "$REPO_URL"

echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ SUCCESS! Your AlphaCloud application has been pushed to GitHub!"
echo ""
echo "🌐 Next Steps:"
echo "1. Go to https://render.com"
echo "2. Connect your GitHub account"
echo "3. Select your repository"
echo "4. Render will auto-detect the configuration"
echo "5. Click 'Create Web Service' to deploy"
echo ""
echo "📚 Documentation:"
echo "- README.md - Main project documentation"
echo "- RENDER_DEPLOYMENT_GUIDE.md - Detailed deployment guide"
echo "- DEPLOYMENT_README.md - Quick reference"
echo "- PACKAGE_VERIFICATION.md - Package verification checklist"
echo ""
echo "🎉 Happy deploying!"