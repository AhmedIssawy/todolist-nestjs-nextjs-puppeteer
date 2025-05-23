# Task Management Application

A full-stack task management application with user authentication, LinkedIn profile integration, and comprehensive task management features. Built with Next.js, NestJS, MongoDB, and Redux Toolkit.

## Features

### Authentication
- User registration and login
- JWT-based secure authentication
- Middleware-based route protection
- Automatic session management and token refresh

### User Management
- User profile creation and management
- LinkedIn profile integration and scraping
- Profile data display and visualization

### Task Management
- Create, read, update, and delete tasks
- Task categorization and filtering system
- Task completion tracking and progress visualization
- Due date tracking with overdue task highlighting
- Task completion statistics and dashboard

### UI/UX
- Modern and responsive design with Tailwind CSS
- Custom modals for task creation, editing, and deletion
- Task filtering by category and completion status
- Loading states and error handling
- Toast notifications for action feedback
- Dashboard with statistics and progress visualization

### Data Synchronization
- Automatic data refetching on changes
- Polling-based data synchronization
- Focus and reconnection-based refetching
- Optimistic updates for immediate UI feedback

## Tech Stack

### Frontend
- Next.js v15.3.2 with App Router
- React v19.0.0
- Redux Toolkit v2.8.2 for state management
- RTK Query
- React Redux v9.2.0
- React Toastify v11.0.5 for notifications
- Tailwind CSS v4.1.7 for styling
- TypeScript v5 for type safety
- PostCSS v8.5.3 for CSS processing

### Backend
- NestJS v11.0.1 framework
- MongoDB with Mongoose ODM v11.0.3
- JWT v11.0.0 for authentication
- Passport v0.7.0 with passport-jwt v4.0.1 for authentication strategies
- bcrypt v6.0.0 for password hashing
- Puppeteer v24.9.0 for LinkedIn profile scraping
- RxJS v7.8.1 for reactive programming
- class-validator v0.14.2 for input validation
- TypeScript (Node.js v22 types)

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB (local or Atlas)
- LinkedIn account (for profile scraping feature)

### Environment Variables

#### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/todo
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d
CLIENT_URL=http://localhost:3000
LINKEDIN_EMAIL=your_linkedin_email
LINKEDIN_PASSWORD=your_linkedin_password
```

## Installation and Setup

### Clone the repository
```bash
git clone https://github.com/AhmedIssawy/todolist-nestjs-nextjs-puppeteer.git
cd task-management-app
```

### Backend Setup
```bash
cd server
npm install
cp .env # Create and edit with your values
npm run start:dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env # Create and edit with your values
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. **Registration/Login**: Create an account or log in with existing credentials
2. **Connect LinkedIn**: Optionally connect your LinkedIn profile for enhanced dashboard
3. **Dashboard**: View your task statistics and progress
4. **Task Management**: Add, edit, delete, and mark tasks as complete
5. **Categorize**: Organize tasks by categories and filter them as needed
6. **Set Due Dates**: Add due dates to tasks to track deadlines
7. **Track Progress**: Monitor your task completion progress

## Folder Structure

### Client
```
client/
├── app/                  # Next.js App Router structure
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout component
│   ├── middleware.ts     # Authentication middleware
│   └── StoreProvider.tsx # Redux provider
├── components/           # Reusable UI components
│   └── ui/               # UI element components
├── lib/                  # Shared utilities
│   ├── api/              # API slices and endpoints
│   ├── hoc/              # Higher-order components
│   ├── hooks/            # Custom hooks
│   └── types/            # TypeScript type definitions
└── public/               # Static assets
```

### Server
```
server/
├── src/
│   ├── auth/             # Authentication module
│   │   ├── jwt.guard.ts  # JWT authentication guard
│   │   └── jwt.strategy.ts # JWT strategy
│   ├── user/             # User module
│   │   ├── puppeteer/    # LinkedIn scraping service
│   │   └── user.schema.ts # MongoDB schema
│   ├── app.module.ts     # Main app module
│   └── main.ts           # App entry point
└── types/                # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
