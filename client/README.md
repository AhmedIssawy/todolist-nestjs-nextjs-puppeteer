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
- Next.js 15+ with App Router
- React 19
- Redux Toolkit for state management
- RTK Query for API data fetching
- Tailwind CSS for styling
- TypeScript for type safety

### Backend
- NestJS framework
- MongoDB with Mongoose ODM
- JWT for authentication
- Passport for authentication strategies
- bcrypt for password hashing
- Puppeteer for LinkedIn profile scraping

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.
