# Development Guide

## 🏗️ Project Architecture

### Overview
The Exam Builder Platform follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  (React + TypeScript + Zustand + Tailwind)                  │
│  - User Interface                                            │
│  - State Management                                          │
│  - PDF Generation                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API
                       │ (JSON)
┌──────────────────────▼──────────────────────────────────────┐
│                         Backend                              │
│  (Node.js + Express + TypeScript)                           │
│  - Authentication & Authorization                            │
│  - Business Logic                                            │
│  - API Endpoints                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL Queries
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                       PostgreSQL                             │
│  - User Data                                                 │
│  - Exams & Components                                        │
│  - Question Bank                                             │
│  - Templates                                                 │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Detailed Structure

### Shared Package (`/shared`)
Contains TypeScript types and interfaces shared between frontend and backend:
- User types
- Exam component types
- API response types
- DTO (Data Transfer Object) types

### Backend (`/backend`)

#### Database Layer
- `database/connection.ts`: PostgreSQL connection pool
- `database/init.ts`: Database schema initialization

#### Middleware
- `middleware/auth.ts`: JWT token verification
- `middleware/errorHandler.ts`: Global error handling

#### Routes
- `routes/auth.routes.ts`: Authentication endpoints
- `routes/exam.routes.ts`: Exam CRUD operations
- `routes/questionBank.routes.ts`: Question bank management
- `routes/template.routes.ts`: Template management

#### Main Entry
- `index.ts`: Express app configuration and server startup

### Frontend (`/frontend`)

#### State Management (Zustand)
- `store/authStore.ts`: User authentication state
- `store/examStore.ts`: Exam data and operations

#### Pages
- `pages/LoginPage.tsx`: User login
- `pages/RegisterPage.tsx`: User registration
- `pages/DashboardPage.tsx`: Exam list and management
- `pages/ExamBuilderPage.tsx`: Exam creation/editing interface
- `pages/QuestionBankPage.tsx`: Question bank management
- `pages/TemplatesPage.tsx`: Template management

#### Components
- `components/Layout.tsx`: Main application layout with navigation

#### Utilities
- `lib/api.ts`: Axios instance with interceptors

## 🔄 Data Flow

### Authentication Flow
```
1. User submits login credentials
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. Backend verifies credentials with bcrypt
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend includes token in all subsequent requests
```

### Exam Creation Flow
```
1. User adds components in ExamBuilderPage
   ↓
2. Components stored in local state
   ↓
3. User clicks "Save"
   ↓
4. Frontend calculates total points
   ↓
5. POST /api/exams with exam data
   ↓
6. Backend validates and stores in database
   ↓
7. Backend returns created exam with ID
   ↓
8. Frontend updates state and redirects to edit page
```

## 🎨 Component Design Patterns

### Exam Components
All exam components implement the `ExamComponent` interface:

```typescript
type ExamComponent = 
  | HeaderComponent 
  | TextComponent 
  | TableComponent 
  | QCMComponent 
  | ImageComponent;
```

Each component has:
- Unique `id`
- Component `type`
- Display `order`
- Type-specific properties

### State Management with Zustand
Simple, performant state management:

```typescript
// Define store
const useStore = create((set) => ({
  data: [],
  fetch: async () => {
    const result = await api.get('/endpoint');
    set({ data: result.data });
  }
}));

// Use in components
const { data, fetch } = useStore();
```

## 🔐 Security Implementation

### Password Security
- Passwords hashed with bcrypt (10 rounds)
- Never stored or transmitted in plain text
- Validation on both client and server

### JWT Authentication
- Tokens signed with secret key
- 24-hour expiration by default
- Stored in localStorage (client)
- Verified on each protected route

### API Security
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet.js security headers
- Input validation with Joi
- SQL injection prevention (parameterized queries)

## 🧩 Adding New Features

### Adding a New Exam Component Type

1. **Update Shared Types** (`shared/src/types.ts`):
```typescript
export interface NewComponent extends BaseComponent {
  type: 'new-type';
  customProperty: string;
}

export type ExamComponent = 
  | HeaderComponent 
  | TextComponent 
  | NewComponent; // Add here
```

2. **Create Frontend Component**:
```typescript
// frontend/src/components/exam/NewComponent.tsx
export function NewComponent({ data, onChange }) {
  return (
    <div>
      {/* Component UI */}
    </div>
  );
}
```

3. **Add to Component Selector**:
```typescript
// In ExamBuilderPage.tsx
const renderComponent = (component) => {
  switch (component.type) {
    case 'new-type':
      return <NewComponent data={component} />;
    // ... other cases
  }
};
```

4. **Update PDF Generation** (if needed):
```typescript
// Add PDF rendering logic for new component
```

### Adding a New API Endpoint

1. **Create Route Handler** (`backend/src/routes/`):
```typescript
router.get('/new-endpoint', authenticateToken, async (req, res) => {
  // Implementation
});
```

2. **Add to Main App** (`backend/src/index.ts`):
```typescript
app.use('/api/new-route', newRouter);
```

3. **Create Frontend API Call** (`frontend/src/store/`):
```typescript
export const useNewStore = create((set) => ({
  fetchData: async () => {
    const response = await api.get('/new-endpoint');
    set({ data: response.data.data });
  }
}));
```

## 🧪 Testing Strategy

### Unit Tests
Test individual functions and components:
```typescript
describe('calculateTotalPoints', () => {
  it('should sum points from all components', () => {
    const components = [
      { type: 'text', points: 5 },
      { type: 'qcm', points: 10 }
    ];
    expect(calculateTotalPoints(components)).toBe(15);
  });
});
```

### Integration Tests
Test API endpoints:
```typescript
describe('POST /api/exams', () => {
  it('should create new exam', async () => {
    const response = await request(app)
      .post('/api/exams')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', components: [] });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### End-to-End Tests
Test complete user workflows with Playwright or Cypress.

## 📊 Database Schema

### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  institution VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Exams Table
```sql
exams (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  components JSONB,  -- Stores array of components
  total_points DECIMAL(10, 2),
  tags TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Question Bank Table
```sql
question_bank (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  component JSONB,  -- Single component
  tags TEXT[],
  difficulty VARCHAR(20),
  subject VARCHAR(100),
  usage_count INTEGER,
  created_at TIMESTAMP
)
```

### Templates Table
```sql
templates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  description TEXT,
  header_component JSONB,
  is_public BOOLEAN,
  usage_count INTEGER,
  created_at TIMESTAMP
)
```

## 🚀 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Memoization with useMemo and useCallback
- Virtual scrolling for long lists
- Optimistic UI updates
- Image lazy loading

### Backend
- Database connection pooling
- Query optimization with indexes
- Caching frequently accessed data
- Pagination for large datasets
- Compression middleware

### Database
- Proper indexes on foreign keys
- JSONB for flexible component storage
- Array types for tags
- Efficient queries with prepared statements

## 🐛 Debugging Tips

### Frontend Debugging
```typescript
// Enable React DevTools
// Use browser console
console.log('State:', useExamStore.getState());

// Network inspection
// Check API calls in Network tab

// State inspection
// Install Redux DevTools (works with Zustand)
```

### Backend Debugging
```typescript
// Enable detailed logging
console.log('Request body:', req.body);
console.log('User ID:', req.userId);

// Database query logging
pool.on('query', (query) => {
  console.log('QUERY:', query.text);
});

// Use nodemon for auto-restart
// Use VS Code debugger
```

## 📝 Code Style Guidelines

### TypeScript
- Use strict mode
- Prefer interfaces over types for objects
- Use type unions for variants
- Avoid `any` type

### React
- Functional components only
- Use hooks appropriately
- Keep components small and focused
- Props destructuring

### File Naming
- Components: PascalCase (UserProfile.tsx)
- Utilities: camelCase (formatDate.ts)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL.ts)

### Git Commits
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

## 🔧 Environment Variables

### Development
```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Production
```env
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
DB_SSL=true
```

## 📦 Build and Deploy

### Build Process
```bash
# Build all packages
npm run build

# Frontend builds to: frontend/dist
# Backend builds to: backend/dist
```

### Deployment Checklist
- [ ] Update environment variables
- [ ] Run database migrations
- [ ] Build production assets
- [ ] Configure SSL certificates
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all critical paths
- [ ] Set up CI/CD pipeline

---

**Happy Coding! 💻✨**
