import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

// Import routes
import authRoutes from '@/api/auth/auth.routes';
import employeeRoutes from '@/api/employees/employee.routes';
import attendanceRoutes from '@/api/attendance/attendance.routes';
import payrollRoutes from '@/api/payroll/payroll.routes';
import projectRoutes from '@/api/projects/project.routes';
import leadRoutes from '@/api/leads/lead.routes';

// Import middleware
import { errorHandler } from '@/middleware/errorHandler';
import { authenticate } from '@/middleware/auth';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employees', authenticate, employeeRoutes);
app.use('/api/v1/attendance', authenticate, attendanceRoutes);
app.use('/api/v1/payroll', authenticate, payrollRoutes);
app.use('/api/v1/projects', authenticate, projectRoutes);
app.use('/api/v1/leads', leadRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
