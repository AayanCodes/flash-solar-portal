# Flash Solar Portal - Enterprise Management System

A comprehensive, production-ready enterprise website and business management portal for Flash Solar Technology Projects Private Limited (OPC).

## 🌟 Project Overview

Flash Solar Portal is a full-stack application that combines:
- **Corporate Website** - Modern, responsive public-facing website
- **Employee Management System (EMS)** - Complete employee lifecycle management
- **Attendance Management** - Daily check-in/check-out with analytics
- **Payroll Management** - Salary generation and payslip management
- **Project Management** - Track solar projects and assignments
- **Lead Management CRM** - Manage customer leads and quotations
- **Admin Dashboard** - Comprehensive analytics and reporting

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **UI Components**: ShadCN UI
- **State Management**: TanStack Query + Zustand
- **Animation**: Framer Motion
- **Charts**: Chart.js / Recharts

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **API Documentation**: Swagger/OpenAPI

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway/Render/VPS
- **Database**: PostgreSQL (Cloud)
- **Storage**: Cloudinary/Firebase

## 📁 Project Structure

```
flash-solar-portal/
├── frontend/                 # Next.js frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── app/             # Next.js 15 app directory
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components (if using pages router)
│   │   ├── lib/             # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript types
│   │   ├── styles/          # Global styles
│   │   └── services/        # API client services
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.ts
│
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── employees/   # Employee management
│   │   │   ├── attendance/  # Attendance tracking
│   │   │   ├── payroll/     # Payroll management
│   │   │   ├── projects/    # Project management
│   │   │   ├── leads/       # Lead/CRM management
│   │   │   └── reports/     # Reporting endpoints
│   │   ├── middleware/      # Express middlewares
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── db/              # Database configuration
│   │   └── app.ts           # Express app setup
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── database/                 # Database migrations and seeds
│   ├── migrations/
│   └── seeds/
│
├── docs/                     # Documentation
│   ├── API.md              # API documentation
│   ├── DATABASE.md         # Database schema docs
│   ├── SETUP.md            # Installation guide
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── FEATURES.md         # Feature documentation
│
└── .github/                 # GitHub configuration
    └── workflows/          # CI/CD pipelines
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## 📋 Features

### Public Website
- ✅ Hero section with video background
- ✅ Company introduction
- ✅ Services showcase
- ✅ Project gallery
- ✅ Blog/News section
- ✅ Careers page
- ✅ Contact form
- ✅ WhatsApp integration
- ✅ Dark/Light mode
- ✅ SEO optimized

### Employee Management
- ✅ Complete employee profiles
- ✅ Document management
- ✅ Skills and qualifications
- ✅ Audit trail
- ✅ Soft delete functionality
- ✅ Employee history tracking

### Attendance System
- ✅ Daily check-in/check-out
- ✅ Late arrival tracking
- ✅ Overtime management
- ✅ Monthly attendance reports
- ✅ Export to Excel/PDF
- ✅ QR-based attendance

### Payroll Management
- ✅ Monthly salary generation
- ✅ Overtime calculations
- ✅ Bonus management
- ✅ Tax calculations
- ✅ PDF payslip generation
- ✅ Payroll history

### Project Management
- ✅ Project creation and tracking
- ✅ Worker assignment
- ✅ Timeline management
- ✅ Progress tracking
- ✅ Completion reports

### Lead Management CRM
- ✅ Lead capture from website
- ✅ Lead status tracking
- ✅ Follow-up reminders
- ✅ Client database
- ✅ Quotation management

### Admin Dashboard
- ✅ Analytics and insights
- ✅ Employee statistics
- ✅ Revenue tracking
- ✅ Attendance summary
- ✅ Project completion rate
- ✅ Lead conversion tracking

## 🔐 Security Features

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Two-Factor Authentication (2FA)
- Data encryption
- Audit logging
- Soft delete functionality
- CSRF protection
- Rate limiting
- Input validation

## 📊 Database Schema

See [DATABASE.md](./docs/DATABASE.md) for complete schema documentation.

Key entities:
- Users
- Employees
- Attendance
- Payroll
- Projects
- Leads
- Documents
- Audit Logs

## 🔗 API Documentation

See [API.md](./docs/API.md) for complete API documentation.

Base URL: `https://api.flashsolar.com/api/v1`

## 📖 Documentation

- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Features Guide](./docs/FEATURES.md)

## 🛠️ Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

## 📦 Deployment

### Vercel (Frontend)
```bash
vercel deploy
```

### Railway/Render (Backend)
See [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 📄 License

Proprietary - Flash Solar Technology Projects Private Limited (OPC)

## 👥 Team

- Project Owner: Flash Solar Technology Projects Private Limited (OPC)
- Development: Full-stack development team

## 📞 Support

For support, contact: support@flashsolar.com

---

**Last Updated**: June 2024
**Status**: Development Phase
