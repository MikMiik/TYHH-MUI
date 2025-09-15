# TYHH MUI - Frontend Architecture Guide

## Tech Stack Overview

### Core Technologies

- **React 18**: Modern hooks-based development
- **Vite**: Fast build tool with HMR
- **MUI (Material-UI)**: Design system và components
- **Redux Toolkit**: State management cho complex state
- **Video.js**: Video player với custom plugins
- **React Router**: Client-side routing

### Build & Development

```json
{
  "scripts": {
    "dev": "vite", // Development server
    "build": "vite build", // Production build
    "lint": "eslint .", // Code linting
    "preview": "vite preview" // Preview build locally
  }
}
```

## Project Structure Deep Dive

### `/src` Directory Organization

#### `/components` - Reusable Components

```
components/
├── AppRoutes.jsx          # Centralized routing configuration
├── BackTop.jsx            # Scroll to top button
├── Form.jsx               # Generic form with validation
├── HeaderActions.jsx      # User menu, login/logout actions
├── HeaderNavigation.jsx   # Main navigation menu
├── HeroCarousel.jsx       # Homepage hero section
├── ImageLazy.jsx          # Lazy loading images
├── ProtectedRoute.jsx     # Route authentication guard
├── VideoJS.jsx            # Video player với view tracking
├── VideoCard.jsx          # Video thumbnail và metadata
└── UserProvider.js        # User context provider
```

**Component Naming Convention:**

- PascalCase cho React components
- `.jsx` extension cho components có JSX
- `.js` cho utilities/providers

#### `/pages` - Route-level Pages

```
pages/
├── Home.jsx               # Landing page
├── Login.jsx              # Authentication page
├── Register.jsx           # User registration
├── Courses.jsx            # Course listing
├── LiveSchedule.jsx       # Livestream schedule
├── Document.jsx           # Document viewer
└── index.js               # Page exports
```

**Page Structure Pattern:**

```jsx
const Home = () => {
  // 1. Hooks (useState, useEffect, custom hooks)
  // 2. Data fetching/API calls
  // 3. Event handlers
  // 4. Render logic với MUI components

  return (
    <Layout>
      <Container>{/* Page content */}</Container>
    </Layout>
  );
};
```

#### `/Layouts` - Layout Components

```
Layouts/
├── DefaultLayout/         # Standard page layout
└── MenuLayout.jsx         # Layout với sidebar menu
```

#### `/services` - API Layer

```
services/
├── authService.js         # Authentication APIs
└── livestreamService.js   # Livestream-related APIs
```

**Service Pattern:**

```js
class AuthService {
  async login(credentials) {
    try {
      const response = await httpRequest.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }
}

export default new AuthService();
```

## Key Features Implementation

### 1. Video Tracking System

**VideoJS Component với View Tracking:**

```jsx
// src/components/VideoJS.jsx

const VideoJS = ({ options, livestreamSlug }) => {
  useEffect(() => {
    const player = videojs(videoElement, options);

    if (livestreamSlug) {
      let totalWatchTime = 0;
      let lastCurrentTime = 0;

      const checkViewProgress = () => {
        const currentTime = player.currentTime();
        const duration = player.duration();

        // Chỉ tính watch time khi xem liên tục (chống tua)
        const timeDiff = currentTime - lastCurrentTime;
        if (timeDiff > 0 && timeDiff <= 2) {
          totalWatchTime += timeDiff;
        }
        lastCurrentTime = currentTime;

        // Track view khi xem đủ 50% thời lượng
        if (totalWatchTime >= duration * 0.5) {
          livestreamService.trackView(livestreamSlug);
        }
      };

      player.on("play", () => {
        interval = setInterval(checkViewProgress, 1000);
      });
    }
  }, []);
};
```

**Key Features:**

- ✅ **Watch time tracking**: Tính thời gian thực sự xem, không phải vị trí video
- ✅ **Anti-seeking**: Phát hiện khi user tua video
- ✅ **50% threshold**: Chỉ track view khi xem đủ nửa video
- ✅ **Cleanup**: Clear intervals khi component unmount

### 2. Authentication Flow

**Protected Routes:**

```jsx
// src/components/ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) return <CircularProgress />;

  return user ? children : <Navigate to="/login" />;
};
```

**User Context:**

```jsx
// src/components/UserProvider.js
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.me();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
```

### 3. Form Handling Pattern

**Generic Form Component:**

```jsx
// src/components/Form.jsx
const Form = ({
  fields, // Array of field configurations
  validationSchema, // Yup validation schema
  onSubmit, // Submit handler
  submitText = "Submit",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <TextInput
          key={field.name}
          {...field}
          {...register(field.name)}
          error={!!errors[field.name]}
          helperText={errors[field.name]?.message}
        />
      ))}

      <Button type="submit" disabled={isSubmitting} variant="contained">
        {isSubmitting ? <CircularProgress size={24} /> : submitText}
      </Button>
    </Box>
  );
};
```

## MUI Theming & Styling

### Theme Configuration

```js
// src/theme/theme.js
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercase
          borderRadius: 8,
        },
      },
    },
  },
});
```

### Custom Hooks

#### `useResponsive.js`

```js
export const useResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return { isMobile, isTablet, isDesktop };
};
```

#### `useDebounce.js`

```js
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

## State Management Strategy

### Local State (useState)

- Component-specific UI state
- Form inputs
- Modal open/close states

### Context API (UserProvider)

- User authentication state
- Theme preferences
- Language settings

### Redux Toolkit

- Complex application state
- Data caching
- Cross-component communication

**Redux Structure:**

```
config/features/auth/
├── authSlice.js        # State slice
├── authAsync.js        # Async thunks
└── index.js           # Exports
```

## Performance Optimization

### Code Splitting

```jsx
// Lazy loading pages
const Home = lazy(() => import('./pages/Home'))
const Courses = lazy(() => import('./pages/Courses'))

// Suspense wrapper
<Suspense fallback={<CircularProgress />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/courses" element={<Courses />} />
  </Routes>
</Suspense>
```

### Image/Video Optimization

```jsx
// Lazy loading images
const ImageLazy = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  return (
    <Box {...props}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      )}
    </Box>
  );
};
```

## Development Workflow

### 1. Local Development

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run lint         # Check code quality
npm run build        # Build for production
```

### 2. Component Development Pattern

1. Create component trong `/components`
2. Implement với MUI components
3. Add PropTypes/TypeScript types
4. Test manual trong browser
5. Add to pages nếu cần

### 3. Feature Development Pattern

1. Plan component structure
2. Create service layer cho API calls
3. Implement UI components
4. Add routing nếu cần
5. Test end-to-end flow

## Testing Strategy

### Manual Testing Checklist

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Form validation messages
- [ ] Loading states
- [ ] Error handling
- [ ] Navigation flow
- [ ] Authentication states

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Test video playback
- Mobile browsers: Test touch interactions

## Common Patterns & Best Practices

### 1. Component Props Pattern

```jsx
const VideoCard = ({
  title,
  thumbnail,
  duration,
  viewCount,
  onClick,
  ...otherProps
}) => {
  return (
    <Card onClick={onClick} {...otherProps}>
      <CardMedia image={thumbnail} />
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">
          {viewCount} views • {duration}
        </Typography>
      </CardContent>
    </Card>
  );
};
```

### 2. API Error Handling

```jsx
const fetchLivestream = async (slug) => {
  try {
    setLoading(true);
    const data = await livestreamService.getLivestreamBySlug(slug);
    setLivestream(data);
  } catch (error) {
    setError(error.message);
    console.error("Failed to fetch livestream:", error);
  } finally {
    setLoading(false);
  }
};
```

### 3. Conditional Rendering Pattern

```jsx
const LivestreamPage = () => {
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!livestream) return <Typography>Livestream not found</Typography>;

  return <LivestreamContent livestream={livestream} />;
};
```

## Troubleshooting

### Common Issues

**1. Video.js không load:**

```jsx
// Đảm bảo import CSS
import "video.js/dist/video-js.css";

// Check element mounting
useEffect(() => {
  if (!playerRef.current && videoRef.current) {
    // Initialize player
  }
}, []);
```

**2. MUI theme không apply:**

```jsx
// Wrap App với ThemeProvider
import { ThemeProvider } from "@mui/material/styles";

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>;
```

**3. Routing issues:**

```jsx
// Đảm bảo BrowserRouter wrap toàn bộ app
<BrowserRouter>
  <AppRoutes />
</BrowserRouter>
```

## Future Development Notes

### Features để thêm:

- [ ] Dark/Light theme toggle
- [ ] Video quality selector
- [ ] Offline viewing capability
- [ ] Progressive Web App (PWA)
- [ ] Real-time chat trong livestream

### Performance improvements:

- [ ] Image optimization với next-gen formats
- [ ] Service Worker cho caching
- [ ] Bundle size optimization
- [ ] Critical CSS inlining
