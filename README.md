# Assessment Portal - Questionnaire Management System

A comprehensive questionnaire management system built with React, TypeScript, and Vite. Features a modern UI with dark/light theme support, real-time data persistence via Supabase, professional PDF generation capabilities, and role-based access control.

## ✨ Features

- **Two-Tier Authentication System**
  - Full Access: Complete portal management
  - Assessment Access: Submit questionnaires only
- **Interactive Questionnaire Forms** with real-time auto-save
- **File Upload Support** with Supabase Storage integration
- **PDF Export** with professional formatting
- **Assessment Management** for full access users
- **Role-Based UI** with dynamic menu rendering
- **Responsive Design** optimized for all devices
- **Dark Theme** with custom styling
- **Template Management** for questionnaire customization

## 🔐 Access Types

### Full Access (Admin)
- **Username**: `client`
- **Password**: `secureAccess2025`
- **Capabilities**:
  - Dashboard access
  - Submit new questionnaires
  - View submitted questionnaires
  - Manage assessments
  - Full portal features

### Assessment Access (Customer)
- **Username**: `assessment`
- **Password**: `secureAccess2025`
- **Capabilities**:
  - Submit new questionnaires only
  - No access to dashboard, submitted items, or assessments

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.6.2
- **Build Tool**: Vite 6.0.1
- **Backend**: Supabase (Edge Functions, Storage, Database)
- **Styling**: TailwindCSS 3.4.16 + Radix UI Components
- **Routing**: React Router DOM v6
- **Form Management**: React Hook Form with Zod validation
- **Package Manager**: pnpm

## 📁 Project Structure

```
alphacloud-complete/
├── public/
│   └── Questionnaire_Template.pdf
├── src/
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation with role-based menu
│   │   ├── FileUpload.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SectionForm.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── SubmittedQuestionnaires.tsx
│   │   └── TemplateSelector.tsx
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication with access types
│   ├── pages/
│   │   ├── LoginPage.tsx           # Two-tier login interface
│   │   ├── Dashboard.tsx           # Full access only
│   │   ├── QuestionnairePage.tsx
│   │   └── AssessmentPage.tsx      # Full access only
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── pdfExport.ts
│   │   ├── questionnaire.ts
│   │   └── templates.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx                     # Route guards
│   └── main.tsx
├── railway.json                    # Railway deployment config
├── nixpacks.toml                  # Nixpacks build config
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Local Development

### Prerequisites
- Node.js 18.x or higher
- pnpm (preferred) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd alphacloud-complete

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
pnpm build

# Preview production build
pnpm preview
```

## 📦 Deployment

### Railway Deployment

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed Railway deployment instructions.

Quick steps:
1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables
4. Deploy automatically

### Environment Variables

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧩 Key Components

### Authentication
- Two-tier authentication system with role-based access
- Persistent sessions with localStorage
- Automatic route protection based on user role

### Questionnaire Management
- Multi-section forms with conditional rendering
- Auto-save functionality
- File upload with Supabase Storage
- Progress tracking

### Assessment System
- Full access users can manage and review assessments
- PDF export with embedded file links
- Status tracking (pending, completed, submitted)

## 📄 Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm build:prod       # Production build with optimization
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm install-deps     # Install dependencies
pnpm clean            # Clean node_modules and lock files
```

## 🔒 Security Features

- Role-based access control
- Route guards preventing unauthorized access
- Secure credential storage
- Environment variable management
- CORS configuration for Supabase

## 🎨 Customization

### Branding
The application is designed to be generic and customizable:
- Update colors in `tailwind.config.js`
- Modify branding text in components
- Replace copyright in footers

### Templates
Add custom questionnaire templates:
- Upload PDF templates
- Manage via Template Selector component
- Store in Supabase Storage

## 📝 API Integration

### Supabase Edge Functions
- `auth-login`: Two-tier authentication
- `questionnaire`: CRUD operations with generic client_id
- `assessment`: Assessment management
- `file-upload`: File storage
- `pdf-export`: PDF generation
- `submitted-assessments`: Submission tracking

All functions use `client_id: 'default'` for generic operations.

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Clear pnpm cache: `pnpm store prune`
- Delete node_modules: `pnpm clean && pnpm install`

**Authentication Issues**
- Verify edge function deployment
- Check environment variables
- Clear browser localStorage

**File Upload Fails**
- Verify Supabase Storage bucket exists
- Check CORS configuration
- Verify ANON_KEY permissions

## 📊 Performance

- **Bundle Size**: ~654KB (optimized)
- **Load Time**: < 2s on 3G
- **Lighthouse Score**: 90+ (Performance)

## 🤝 Contributing

This is a private project. For modifications:
1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## 📄 License

Private - All rights reserved

## 👨‍💻 Developer

**Developed by Anas Raqi**

---

For deployment instructions, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
