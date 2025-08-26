# UI/UX Project Structure & Routing Workflow (Cursor AI Instructions)

This document provides standardized guidelines for Cursor AI to understand, generate, and maintain modern React UI/UX projects with consistent architecture and routing patterns.

## 🎯 Core Principles

- **Separation of Concerns**: UI components, business logic, and routing are clearly separated
- **Modularity**: Each component/page/layout has a single responsibility
- **Scalability**: Structure supports growth without architectural changes
- **Consistency**: Predictable patterns across all project files

## 📁 Standard Directory Structure

```
src/
├── App.jsx                 # Root app component with providers
├── main.jsx               # Application entry point
├── components/            # Reusable UI components
│   ├── AppRoutes.jsx     # Central routing configuration
│   ├── UI/               # Base UI components (buttons, inputs, etc.)
│   └── Features/         # Feature-specific components
├── pages/                # Route-level page components
│   ├── Home.jsx
│   ├── About.jsx
│   └── index.js          # Export barrel file
├── layouts/              # Page layout templates
│   ├── DefaultLayout/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   └── AuthLayout/
├── routes/               # Routing configuration
│   ├── config.js         # Route path constants
│   └── index.js          # Route definitions
├── hooks/                # Custom React hooks (UI logic only)
├── utils/                # Pure utility functions
├── assets/               # Static files (images, videos, fonts)
└── styles/               # Global styles/theme configuration
```

## 🔧 Key File Templates

### Route Configuration (`src/routes/config.js`)

```javascript
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '*',
}
```

### Route Definitions (`src/routes/index.js`)

```javascript
import { ROUTES } from './config'
import { Home, About, Contact, Login, Dashboard } from '@/pages'
import { DefaultLayout, AuthLayout } from '@/layouts'

export const routes = [
  {
    path: ROUTES.HOME,
    component: Home,
    layout: DefaultLayout,
    public: true,
  },
  {
    path: ROUTES.LOGIN,
    component: Login,
    layout: AuthLayout,
    public: true,
  },
  {
    path: ROUTES.DASHBOARD,
    component: Dashboard,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: ROUTES.NOT_FOUND,
    component: NotFound,
    layout: DefaultLayout,
    public: true,
  },
]
```

### AppRoutes Component (`src/components/AppRoutes.jsx`)

```javascript
import { Routes, Route } from 'react-router-dom'
import { routes } from '@/routes'

function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => {
        const { path, component: Component, layout: Layout } = route

        return (
          <Route
            key={path}
            path={path}
            element={
              Layout ? (
                <Layout>
                  <Component />
                </Layout>
              ) : (
                <Component />
              )
            }
          />
        )
      })}
    </Routes>
  )
}

export default AppRoutes
```

### Layout Template (`src/layouts/DefaultLayout/DefaultLayout.jsx`)

```javascript
import Header from './Header'
import Footer from './Footer'

function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default DefaultLayout
```

## 📋 Cursor AI Generation Rules

### When Creating Components:

1. **Always use functional components** with hooks
2. **Import paths**: Use `@/` alias for src folder imports
3. **Props typing**: Include PropTypes or TypeScript interfaces
4. **Export pattern**: Use default exports for components
5. **File naming**: PascalCase for components, camelCase for utilities

### When Creating Pages:

1. **Single responsibility**: Each page handles one main view/route
2. **Composition**: Build pages by composing smaller components
3. **No business logic**: Keep pages focused on UI orchestration
4. **SEO considerations**: Include proper meta tags and titles

### When Creating Routes:

1. **Centralized config**: All routes defined in `src/routes/`
2. **Consistent naming**: Use SCREAMING_SNAKE_CASE for route constants
3. **Layout association**: Each route should specify its layout
4. **Access control**: Mark routes as public/protected as needed

### When Creating Layouts:

1. **Reusability**: Design for multiple page types
2. **Responsive**: Include mobile-first responsive design
3. **Accessibility**: Proper semantic HTML and ARIA labels
4. **Performance**: Lazy load non-critical layout components

## 🎨 Styling Guidelines

### Framework Support:

- **Tailwind CSS**: Preferred for utility-first styling
- **CSS Modules**: For component-scoped styles
- **Styled Components**: For dynamic styling needs
- **MUI/Chakra**: For component library integration

### Style Organization:

```
styles/
├── globals.css           # Global styles and resets
├── variables.css         # CSS custom properties
├── components.css        # Component-specific styles
└── utilities.css         # Custom utility classes
```

## 🔄 Development Workflow

### 1. Adding a New Page:

```bash
1. Create page component in src/pages/NewPage.jsx
2. Add route constant to src/routes/config.js
3. Add route definition to src/routes/index.js
4. Update src/pages/index.js exports
5. Add navigation links where needed
```

### 2. Creating Reusable Components:

```bash
1. Create component in src/components/ui/ or src/components/features/
2. Follow naming convention: PascalCase
3. Include proper prop validation
4. Add to component exports if needed
5. Document usage with JSDoc comments
```

### 3. Custom Hooks:

```bash
1. Create in src/hooks/ with "use" prefix
2. Focus on UI logic only (no business logic)
3. Return consistent object/array patterns
4. Include proper dependency arrays
5. Add TypeScript types if applicable
```

## ⚡ Performance Optimization

### Code Splitting:

```javascript
// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))

// Wrap in Suspense
;<Suspense fallback={<Loading />}>
  <AppRoutes />
</Suspense>
```

### Bundle Optimization:

- Use `React.memo()` for expensive components
- Implement proper key props for lists
- Lazy load heavy dependencies
- Optimize image assets in `src/assets/`

## 🚨 Common Patterns to Avoid

❌ **Don't:**

- Put business logic in components or pages
- Use inline styles extensively
- Create deeply nested component hierarchies
- Import entire libraries when only using parts
- Mix routing logic with component logic

✅ **Do:**

- Keep components pure and focused
- Use proper TypeScript/PropTypes
- Implement consistent error boundaries
- Follow established naming conventions
- Use proper semantic HTML

## 🔍 File Naming Conventions

```
Components:     PascalCase    (Button.jsx, UserProfile.jsx)
Pages:          PascalCase    (Home.jsx, Dashboard.jsx)
Hooks:          camelCase     (useAuth.js, useLocalStorage.js)
Utils:          camelCase     (formatDate.js, httpClient.js)
Constants:      UPPER_CASE   (API_ENDPOINTS.js, ROUTES.js)
Assets:         kebab-case   (hero-image.jpg, user-avatar.png)
```

## 🎯 Quality Checklist

Before generating/modifying code, ensure:

- [ ] Proper imports with `@/` aliases
- [ ] Consistent file and folder naming
- [ ] Appropriate component composition
- [ ] Proper route configuration
- [ ] Responsive design considerations
- [ ] Accessibility attributes
- [ ] Performance optimizations
- [ ] Error handling
- [ ] Clean, readable code structure

---

**Note for Cursor AI**: Always follow this structure when generating new components, pages, or modifying existing code. Prioritize consistency, maintainability, and modern React best practices in all generated code.
