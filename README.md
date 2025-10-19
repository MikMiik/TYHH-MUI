# TYHH MUI - Learning Management System

Web application for online learning and course management built with React, Material-UI, and Vite.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Google OAuth Client ID (Required for login functionality)
VITE_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

> ⚠️ **Important**: See `.env.example` for the template

### 3. Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a project or select existing one
3. Create OAuth 2.0 Client ID
4. Add `http://localhost:5173` to **Authorized JavaScript origins**
5. Copy the Client ID to your `.env` file

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📦 Build for Production

```bash
# Set environment variable first
export VITE_APP_GOOGLE_CLIENT_ID=your-production-client-id

# Build
npm run build

# Preview production build locally
npm run preview
```

> ⚠️ **Important**: Environment variables must be set BEFORE building, not at runtime!

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🚨 Troubleshooting

### Google Login Button is Disabled in Production

This happens when `VITE_APP_GOOGLE_CLIENT_ID` is not set during build time.

**Solution:**
1. Ensure environment variable is set in your deployment platform (Vercel/Netlify/etc.)
2. Rebuild the project after setting the variable
3. Add your production domain to Google Console's Authorized JavaScript origins

📖 See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🛠️ Tech Stack

- **React 19** - UI Library
- **Material-UI (MUI) v7** - Component Library
- **Vite** - Build Tool
- **Redux Toolkit** - State Management
- **React Router v7** - Routing
- **React Hook Form + Yup** - Form Validation
- **Axios** - HTTP Client
- **@react-oauth/google** - Google Authentication

---

## 📁 Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── features/       # Redux slices & API
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── routes/         # Route configuration
├── schemas/        # Validation schemas
├── services/       # API services
├── store/          # Redux store
├── theme/          # MUI theme configuration
└── utils/          # Utility functions
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_APP_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | Yes (for Google login) |

---

## 📝 Notes

- Google Client ID is public and safe to expose in frontend code
- Each environment (dev/prod) should use its own Client ID with appropriate authorized origins
- File `.env` is gitignored for security

---

## 🔗 Related Projects

- **Backend**: `TYHH BE` - Node.js/Express API
- **Admin Panel**: `TYHH ADMIN` - Next.js admin dashboard
