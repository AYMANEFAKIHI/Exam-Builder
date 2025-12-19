# Interactive Exam Builder Platform 📝

A comprehensive web-based platform that allows educators to create customized exam papers through an intuitive drag-and-drop interface with LaTeX support, PDF export, and question bank management.

## 🚀 Features

### Core Functionality
- **Drag-and-Drop Exam Builder**: Easily assemble exams with various components
- **Dynamic Components**:
  - Fixed Header (logo, exam title, academic info, student fields)
  - Text Fields (with LaTeX support)
  - Tables (for matching exercises, data analysis)
  - Multiple Choice Questions (QCM)
  - Image Zones (for diagrams and graphs)
- **Live Preview**: Real-time preview of exam layout
- **PDF Export**: Professional, printable PDF generation
- **LaTeX Support**: Mathematical equations via MathJax
- **Question Bank**: Save and reuse questions across exams
- **Templates**: Reusable header templates
- **User Authentication**: Secure JWT-based authentication

### Advanced Features
- Automatic scoring calculations
- Correction grid generation
- Tag-based organization
- Search and filter functionality
- Responsive design

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **react-beautiful-dnd** for drag-and-drop
- **jsPDF + html2canvas** for PDF generation
- **MathJax** for LaTeX rendering
- **Axios** for API requests

### Backend
- **Node.js** with Express
- **TypeScript**
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Helmet** for security

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

## 🔧 Installation

### 1. Clone the repository
```bash
cd c:\Users\fayma\OneDrive\Desktop\professeur
```

### 2. Install dependencies
```bash
npm run install-all
```

This will install dependencies for the root, frontend, backend, and shared packages.

### 3. Set up PostgreSQL database

Create a new PostgreSQL database:
```sql
CREATE DATABASE exam_builder;
```

### 4. Configure environment variables

Copy the example environment file:
```bash
cd backend
copy .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=exam_builder
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_random_jwt_secret_key_here
JWT_EXPIRES_IN=24h

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

CORS_ORIGIN=http://localhost:5173
```

### 5. Initialize the database

The database tables will be created automatically when you first start the backend server.

## 🚀 Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
professeur/
├── .github/
│   └── copilot-instructions.md
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   └── init.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── exam.routes.ts
│   │   │   ├── questionBank.routes.ts
│   │   │   └── template.routes.ts
│   │   └── index.ts
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ExamBuilderPage.tsx
│   │   │   ├── QuestionBankPage.tsx
│   │   │   └── TemplatesPage.tsx
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   └── examStore.ts
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
├── shared/
│   ├── src/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── README.md
```

## 🎯 Usage

### 1. Create an Account
- Navigate to the registration page
- Fill in your details (email, name, institution)
- Create a strong password

### 2. Create an Exam
- Click "Create New Exam" on the dashboard
- Add a title for your exam
- Add components from the toolbar:
  - **Header**: Add school logo and exam information
  - **Text Field**: Add questions or instructions
  - **Table**: Create matching exercises or data tables
  - **QCM**: Add multiple choice questions
  - **Image**: Upload and insert images

### 3. Use LaTeX for Math
- Enable LaTeX in text fields or QCM options
- Write equations using LaTeX syntax:
  - Inline: `$E = mc^2$`
  - Display: `$$\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$`

### 4. Save to Question Bank
- Save frequently used questions to your question bank
- Tag questions for easy retrieval
- Reuse questions across multiple exams

### 5. Export to PDF
- Click "Export PDF" to generate a printable version
- Choose options for answer keys and correction grids
- Print or save the PDF

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get single exam
- `POST /api/exams` - Create exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam

### Question Bank
- `GET /api/question-bank` - Get all questions
- `POST /api/question-bank` - Add question
- `DELETE /api/question-bank/:id` - Delete question
- `POST /api/question-bank/:id/use` - Increment usage count

### Templates
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/use` - Increment usage count

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🏗️ Building for Production

### Build all packages
```bash
npm run build
```

### Build individually
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## 🚢 Deployment

### Backend
1. Set `NODE_ENV=production` in your environment
2. Configure production database credentials
3. Build the backend: `npm run build`
4. Start the server: `npm start`

### Frontend
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)
3. Update API base URL for production

### Database
- Run migrations on production database
- Ensure PostgreSQL is configured with proper security
- Set up regular backups

## 🔒 Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js for security headers
- Input validation on all endpoints
- File upload size restrictions

## 📝 Future Enhancements

- [ ] Advanced drag-and-drop interface with full component reordering
- [ ] Real-time collaboration features
- [ ] Exam randomization (shuffle questions/options)
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Export to multiple formats (Word, LaTeX)
- [ ] Automated grading for QCM
- [ ] Question difficulty analysis
- [ ] Integration with Learning Management Systems (LMS)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@exambuilder.com or open an issue on GitHub.

## 🙏 Acknowledgments

- MathJax for LaTeX rendering
- react-beautiful-dnd for drag-and-drop functionality
- jsPDF for PDF generation
- All open-source contributors

---

**Built with ❤️ for educators by educators**
