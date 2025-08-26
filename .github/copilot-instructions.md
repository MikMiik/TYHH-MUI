# Copilot Instructions for TYHH-MUI

## Project Overview

- **Framework:** React (with Vite for build/dev), using MUI for UI components, always use MCP MUI when work with component.
- **Structure:**
  - `src/components/`: Reusable UI and logic components (e.g., `HeroCarousel`, `VideoCard`, `Form`).
  - `src/pages/`: Route-level pages (e.g., `Home.jsx`, `Login.jsx`).
  - `src/Layouts/`: Layout wrappers for pages, with nested header/footer components.
  - `src/services/`: API logic (e.g., `authService.js`).
  - `src/store/`: Redux store setup.
  - `src/config/features/auth/`: Redux slices and async logic for authentication.
  - `src/theme/`: MUI theme customization.
  - `src/utils/`: Utility functions (e.g., `httpRequest.js`).

## Key Patterns & Conventions

- **Routing:** Centralized in `src/components/AppRoutes.jsx` and `src/routes/`.
- **State Management:** Uses Redux Toolkit (`src/store/`, `src/config/features/auth/`).
- **Theming:** All MUI theme overrides in `src/theme/theme.js`.
- **Lazy Loading:** Images via `ImageLazy.jsx`, videos via `VideoJS.jsx`.
- **Protected Routes:** `ProtectedRoute.jsx` guards authenticated pages.
- **Forms:** Validation schemas in `src/schemas/` (Yup-based), used in `Form.jsx`.
- **Responsive Design:** Custom hook `useResponsive.js` and MUI breakpoints.

## Developer Workflows

- **Start Dev Server:** `npm run dev` (Vite, HMR enabled)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (ESLint, config in `eslint.config.js`)
- **No built-in test suite** (add tests in `src/` if needed)

## Integration & Data Flow

- **API Calls:** Centralized in `src/services/` and `src/utils/httpRequest.js`.
- **Redux Async:** Async logic in `authAsync.js`, state in `authSlice.js`.
- **Component Communication:** Props, context (`UserProvider.js`), and Redux.

## Project-Specific Notes

- **File Naming:** PascalCase for components, camelCase for hooks and utils.
- **Assets:** Images/videos in `src/assets/`.
- **No TypeScript** (JS only).
- **Vite config:** See `vite.config.js` for aliases and plugin setup.

## Examples

- To add a new page: create in `src/pages/`, add route in `AppRoutes.jsx`.
- To add a new API call: add to `src/services/`, use in Redux async or component.
- To update theme: edit `src/theme/theme.js`.

---

For more details, see `README.md` and explore the `src/` directory for patterns.
