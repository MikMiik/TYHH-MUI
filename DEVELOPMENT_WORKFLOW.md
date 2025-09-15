# TYHH Project - Development Workflow Guide

## Project Setup & Environment

### Prerequisites

```bash
Node.js >= 16.x
npm >= 8.x
MySQL >= 8.0
Redis >= 6.0 (optional, for caching)
```

### Initial Setup

#### 1. Clone và Setup Backend

```bash
cd "TYHH BE"

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Configure database, JWT secrets, etc.

# Database setup
npm run migrate
npm run seed

# Start development server
npm run dev
```

#### 2. Setup Frontend

```bash
cd "TYHH MUI"

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Environment Variables

#### Backend (.env)

```bash
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tyhh_dev
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email (for authentication)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

#### Frontend (.env)

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME="TYHH Learning Platform"
```

## Development Workflow

### Daily Development Flow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start backend
cd "TYHH BE"
npm run dev

# 3. Start frontend (in new terminal)
cd "TYHH MUI"
npm run dev

# 4. Develop features
# 5. Test manually in browser
# 6. Commit changes
# 7. Push to repository
```

### Feature Development Process

#### 1. Planning Phase

- [ ] Analyze requirements
- [ ] Design API endpoints (if needed)
- [ ] Plan component structure
- [ ] Identify database changes

#### 2. Backend Development (if needed)

```bash
# Create new migration (if database changes)
npx sequelize-cli migration:generate --name add-new-feature

# Update models
# Add/update services
# Create/update controllers
# Add/update routes
# Add middleware if needed

# Test API endpoints manually
curl -X GET http://localhost:3000/api/your-endpoint
```

#### 3. Frontend Development

```bash
# Create new components in /src/components
# Add new pages in /src/pages
# Update services for API calls
# Add routing if needed
# Style with MUI components

# Test in browser manually
# Check responsive design
# Test error cases
```

#### 4. Integration Testing

- [ ] Test full user flow
- [ ] Check authentication states
- [ ] Verify error handling
- [ ] Test edge cases
- [ ] Cross-browser compatibility

## Code Standards & Best Practices

### Backend Code Style

#### Service Layer Pattern

```js
// ✅ Good: Clear, single responsibility
class LivestreamService {
  async getLivestreamBySlug(slug) {
    const livestream = await Livestream.findOne({ where: { slug } });
    if (!livestream) {
      throw new Error("Livestream not found");
    }
    return livestream;
  }
}

// ❌ Avoid: Multiple responsibilities, complex logic
class LivestreamService {
  async getLivestreamBySlugWithUserAndAnalyticsAndCache(slug, userId) {
    // Too many responsibilities in one method
  }
}
```

#### Controller Pattern

```js
// ✅ Good: Thin controllers, delegate to services
exports.getOne = async (req, res) => {
  try {
    const { slug } = req.params;
    const data = await livestreamService.getLivestreamBySlug(slug);
    res.success(200, data);
  } catch (error) {
    console.error("Error in getOne:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Avoid: Fat controllers with business logic
exports.getOne = async (req, res) => {
  // Lots of database queries and business logic here
};
```

#### Error Handling

```js
// ✅ Good: Explicit error handling
try {
  await Livestream.increment("view", { where: { id: livestreamId } });
  console.log(`✅ View count updated for livestream ${livestreamId}`);
} catch (error) {
  console.error("❌ Error updating view count:", error.message);
  // Don't throw if it's not critical
}

// ❌ Avoid: Silent failures
await Livestream.increment("view", { where: { id: livestreamId } });
// No error handling
```

### Frontend Code Style

#### Component Structure

```jsx
// ✅ Good: Clear structure, single responsibility
const VideoCard = ({ title, thumbnail, duration, onClick }) => {
  const { isMobile } = useResponsive();

  return (
    <Card onClick={onClick}>
      <CardMedia
        component="img"
        height={isMobile ? "160" : "200"}
        image={thumbnail}
        alt={title}
      />
      <CardContent>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {duration}
        </Typography>
      </CardContent>
    </Card>
  );
};

// ❌ Avoid: Complex components with multiple responsibilities
const VideoCardWithUserMenuAndAnalytics = ({ ...manyProps }) => {
  // Too much logic in one component
};
```

#### API Integration

```js
// ✅ Good: Proper error handling, loading states
const [livestream, setLivestream] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchLivestream = async () => {
    try {
      setLoading(true);
      const data = await livestreamService.getLivestreamBySlug(slug);
      setLivestream(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch livestream:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchLivestream();
}, [slug]);

if (loading) return <CircularProgress />;
if (error) return <Alert severity="error">{error}</Alert>;
if (!livestream) return <Typography>Not found</Typography>;

// ❌ Avoid: No loading/error states
const [livestream, setLivestream] = useState(null);

useEffect(() => {
  livestreamService.getLivestreamBySlug(slug).then(setLivestream);
}, [slug]);

return <div>{livestream?.title}</div>; // Can be undefined
```

## Testing Strategy

### Manual Testing Checklist

#### Backend API Testing

```bash
# Health check
curl http://localhost:3000/health

# Authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Livestream endpoints
curl http://localhost:3000/api/livestreams/sample-slug
curl -X POST http://localhost:3000/api/livestreams/sample-slug/view \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Error cases
curl http://localhost:3000/api/livestreams/non-existent-slug
```

#### Frontend Manual Testing

- [ ] **Responsive Design**: Test trên mobile, tablet, desktop
- [ ] **Navigation**: Tất cả links hoạt động
- [ ] **Authentication**: Login/logout flow
- [ ] **Video Player**: Play, pause, seeking, volume
- [ ] **Forms**: Validation, error messages, loading states
- [ ] **Error Handling**: Network errors, 404 pages
- [ ] **Performance**: Page load times, video loading

### Browser Testing Matrix

| Browser       | Version | Status                 |
| ------------- | ------- | ---------------------- |
| Chrome        | Latest  | ✅ Primary             |
| Firefox       | Latest  | ✅ Secondary           |
| Edge          | Latest  | ✅ Secondary           |
| Safari        | Latest  | ⚠️ Test video playback |
| Mobile Chrome | Latest  | ✅ Priority            |
| Mobile Safari | Latest  | ⚠️ iOS testing         |

### Performance Testing

#### Backend Performance

```bash
# Load testing với ab (Apache Bench)
ab -n 1000 -c 10 http://localhost:3000/api/livestreams/sample-slug

# Monitor database performance
# Check slow query logs
# Monitor memory usage
```

#### Frontend Performance

```bash
# Build size analysis
npm run build
npm run build -- --analyze

# Lighthouse audit
# Check Core Web Vitals
# Monitor bundle size
```

## Database Management

### Migration Workflow

```bash
# Create new migration
npx sequelize-cli migration:generate --name describe-your-change

# Edit migration file
# Add up() and down() methods

# Run migration
npm run migrate

# If needed, rollback
npx sequelize-cli db:migrate:undo

# Check migration status
npx sequelize-cli db:migrate:status
```

### Seeding Data

```bash
# Create seed file
npx sequelize-cli seed:generate --name demo-livestreams

# Edit seed file with sample data

# Run seeds
npm run seed

# If needed, undo seeds
npx sequelize-cli db:seed:undo
```

### Database Backup & Restore

```bash
# Backup
mysqldump -u root -p tyhh_dev > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
mysql -u root -p tyhh_dev < backup_20231201_140530.sql
```

## Deployment Process

### Pre-deployment Checklist

- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Build succeeds without errors
- [ ] Performance acceptable

### Deployment Steps

#### Backend Deployment

```bash
# 1. Build application (if needed)
npm run build

# 2. Run migrations on production
NODE_ENV=production npm run migrate

# 3. Start application with PM2
pm2 start ecosystem.config.js --env production

# 4. Check status
pm2 status
pm2 logs tyhh-be
```

#### Frontend Deployment

```bash
# 1. Build for production
npm run build

# 2. Deploy to hosting (Vercel/Netlify/S3)
# Copy dist/ folder to web server

# 3. Configure web server
# Setup redirects for SPA routing
# Configure CORS headers
```

### Environment Configuration

#### Production Environment Variables

```bash
# Backend
NODE_ENV=production
PORT=3000
DB_HOST=production-db-host
JWT_SECRET=strong-production-secret

# Frontend
VITE_API_BASE_URL=https://api.yoursite.com
```

## Monitoring & Debugging

### Logging Strategy

#### Backend Logging

```js
// Structured logging
console.log(
  `📊 View tracked: User ${userId} viewed livestream ${livestreamId}`
);
console.log(`✅ Database operation completed: ${operation}`);
console.error(`❌ Error in ${functionName}:`, error.message);

// Log levels
// 📊 Info: Business events
// ✅ Success: Operations completed
// ⚠️ Warning: Non-critical issues
// ❌ Error: Critical failures
```

#### Frontend Logging

```js
// Development logging
console.log("🔄 User seeked to", currentTime, "watch time:", totalWatchTime);
console.log("✅ API call successful:", response);
console.error("❌ Error in component:", error);

// Production: Use proper logging service
// Remove console.logs in production build
```

### Performance Monitoring

#### Backend Metrics

- Response time: < 500ms average
- Database query time: < 100ms average
- Memory usage: Monitor for leaks
- Error rate: < 1%

#### Frontend Metrics

- First Contentful Paint: < 2s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

### Debugging Tools

#### Backend Debugging

```bash
# Debug mode
DEBUG=* npm run dev

# Database query logging
# Enable in config/database.js
logging: console.log

# Memory profiling
node --inspect server.js

# PM2 monitoring
pm2 monit
```

#### Frontend Debugging

```bash
# React Developer Tools
# Redux DevTools
# Network tab inspection
# Performance profiling

# Build analysis
npm run build -- --analyze
```

## Troubleshooting Common Issues

### Backend Issues

#### Database Connection Problems

```bash
# Check environment variables
echo $DB_HOST $DB_NAME $DB_USERNAME

# Test connection
mysql -h $DB_HOST -u $DB_USERNAME -p $DB_NAME

# Check migration status
npx sequelize-cli db:migrate:status
```

#### JWT Token Issues

```js
// Debug token in middleware
console.log("Token from header:", req.headers.authorization);
console.log("Decoded payload:", decoded);

// Check token expiration
// Verify JWT secret matches
```

#### Redis Connection Issues

```bash
# Check Redis service
redis-cli ping

# Check configuration
echo $REDIS_HOST $REDIS_PORT
```

### Frontend Issues

#### Video.js Problems

```jsx
// Check if Video.js loaded
console.log("videojs available:", typeof videojs);

// Verify element mounting
useEffect(() => {
  console.log("Video element ref:", videoRef.current);
  if (videoRef.current && !playerRef.current) {
    // Initialize player
  }
}, []);
```

#### MUI Theme Issues

```jsx
// Verify ThemeProvider wrapping
import { ThemeProvider } from "@mui/material/styles";

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>;

// Check theme object
console.log("Theme:", theme);
```

#### API Connection Issues

```js
// Check API base URL
console.log("API base URL:", import.meta.env.VITE_API_BASE_URL);

// Network debugging
fetch("/api/health")
  .then((res) => console.log("API response:", res.status))
  .catch((err) => console.error("API error:", err));
```

## Git Workflow

### Branch Strategy

```bash
# Main branch: production-ready code
main

# Feature branches: new features/fixes
feature/view-tracking-system
feature/user-authentication
bugfix/video-loading-issue

# Hotfix: critical production fixes
hotfix/security-patch
```

### Commit Message Format

```bash
# Format: type(scope): description
feat(tracking): add view counting based on watch time
fix(video): resolve player initialization issue
docs(readme): update setup instructions
refactor(auth): simplify JWT middleware
style(ui): improve mobile responsive design
```

### Pull Request Process

1. Create feature branch
2. Develop feature
3. Test thoroughly
4. Create pull request
5. Code review
6. Merge to main
7. Deploy

---

## Key Principles to Remember

1. **KISS (Keep It Simple, Stupid)**: Simple solutions first
2. **Manual testing**: Click through everything
3. **Error handling**: Always handle errors gracefully
4. **Logging**: Log business events for debugging
5. **Performance**: Measure before optimizing
6. **User experience**: Prioritize user experience over technical perfection
