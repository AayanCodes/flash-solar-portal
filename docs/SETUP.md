# Setup Guide

## Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or yarn
- Git

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/flash_solar_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRE="7d"
NODE_ENV="development"
PORT=5000
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data
npm run prisma:seed
```

### 4. Start Backend
```bash
npm run dev
```

Backend will be available at `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```

Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Flash Solar Portal
```

### 3. Start Frontend
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Accessing the Application

1. **Login Page**: http://localhost:3000/login
2. **Register**: http://localhost:3000/register
3. **Dashboard**: http://localhost:3000/dashboard

### Default Admin Credentials
- Email: `admin@flashsolar.com`
- Password: `Admin@123`

## Database Management

### View Database (Prisma Studio)
```bash
cd backend
npm run prisma:studio
```

### Run New Migration
```bash
npm run prisma:migrate
```

### Reset Database
```bash
npm run prisma:migrate reset
```

## Development

### TypeScript Compilation
```bash
# Frontend
cd frontend && npm run type-check

# Backend
cd backend && npm run type-check
```

### Linting
```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify database credentials

### Port Already in Use
- Backend: `lsof -i :5000` and kill the process
- Frontend: `lsof -i :3000` and kill the process

### Dependencies Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Next Steps

1. Configure email service for notifications
2. Set up Cloudinary for image uploads
3. Configure SMS gateway for attendance alerts
4. Set up payment gateway for online transactions
5. Configure backup and disaster recovery
