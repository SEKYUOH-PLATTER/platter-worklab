# Platter WorkLab

## Overview

Platter WorkLab is a B2B AI education platform designed for non-technical business teams. The platform provides curriculum recommendations, blog content management, and contact inquiry handling. It features a public-facing website with educational content and an admin panel for content and inquiry management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM v7 with HashRouter for client-side navigation
- **Styling**: Tailwind CSS via CDN with custom animations
- **Animation**: Framer Motion for scroll reveals and transitions
- **Rich Text**: Quill editor for blog post creation in admin
- **SEO**: React Helmet Async for meta tag management

### Backend Architecture
- **Runtime**: Express.js server running on port 3001
- **Build Tool**: Vite for frontend bundling and development server (port 5000)
- **API Proxy**: Vite proxies `/api` requests to the Express backend
- **TypeScript Execution**: tsx for running TypeScript server code directly

### Data Storage
- **Database**: Supabase (PostgreSQL-based)
- **Tables**:
  - `posts`: Blog content with id, title, category, thumbnail_url, content, view_count, created_at
  - `contacts`: Inquiry submissions with company_name, contact_person, email, phone, message, created_at
- **Client**: Supabase JS client initialized from environment variables

### Authentication
- **Admin Access**: Password-based authentication (requires ADMIN_PASSWORD env var)
- **Storage**: localStorage flag (`isAdminAuthenticated`) for session persistence
- **Protected Routes**: ProtectedRoute component redirects unauthenticated users to login
- **Access**: Admin panel is accessible only via `/admin` URL (no link in navbar)

### AI Integration
- **Provider**: Google Gemini API (`@google/genai` package)
- **Model**: gemini-3-flash-preview
- **Use Case**: Curriculum recommendations based on user role and business needs
- **Response Format**: Structured JSON with schema validation

### Key Design Patterns
- **Layout Wrapper**: Conditionally hides Navbar/Footer for admin routes
- **Infinite Scroll**: react-intersection-observer for blog post pagination
- **Content Sanitization**: DOMPurify for safe HTML rendering from rich text

## Project Structure

```
/
├── components/         # React components (Navbar, Footer, SEO)
├── pages/              # Page components (Home, Blog, Contact, Admin, Login)
├── lib/                # Supabase client and utilities
├── server/             # Express.js backend (index.ts)
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app with routing
├── index.tsx           # React entry point
├── vite.config.ts      # Vite configuration with API proxy
└── vite-env.d.ts       # Vite environment type definitions
```

## External Dependencies

### Third-Party Services
- **Supabase**: Database and backend-as-a-service
  - Environment: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Google Gemini AI**: Curriculum recommendation engine
  - Environment: `GEMINI_API_KEY`
- **Gmail SMTP**: Email notifications via Nodemailer
  - Environment: `EMAIL_USER`, `EMAIL_PASS`

### Key NPM Packages
- `@supabase/supabase-js`: Database client
- `@google/genai`: Gemini AI SDK
- `nodemailer`: Email sending
- `quill` / `react-quill`: Rich text editing
- `dompurify`: HTML sanitization
- `date-fns`: Date formatting with Korean locale
- `framer-motion`: Animations
- `react-intersection-observer`: Scroll detection

### Environment Variables Required
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `GEMINI_API_KEY`: Google AI API key
- `EMAIL_USER`: Gmail address for notifications
- `EMAIL_PASS`: Gmail app password
- `ADMIN_PASSWORD`: Admin login password (required, no default)

## Database Schema

### posts table
- `id` (int8, primary key)
- `title` (text)
- `category` (text)
- `thumbnail_url` (text)
- `content` (text)
- `view_count` (int8, default 0)
- `created_at` (timestamptz)

### contacts table
- `id` (int8, primary key)
- `company_name` (text)
- `contact_person` (text)
- `email` (text)
- `phone` (text)
- `message` (text)
- `created_at` (timestamptz)