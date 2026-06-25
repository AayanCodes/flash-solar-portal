import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/middleware/auth';
import { authorize } from '@/middleware/authorize';
import { Role } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const CreatePayrollSchema = z.object({
  employeeId: z.string(),
  month: z.number().min(1).max(12),
  year: z.number(),
  baseSalary: z.number(),
  allowances: z.number().default(0),
  deductions: z.number().default(0),
  overtimePay: z.number().default(0),
  bonusAmount: z.number().default(0),
});

// Create payroll
router.post('/', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), async (req: Request, res: Response) => {
  try {
    const data = CreatePayrollSchema.parse(req.body);
    const taxAmount = (data.baseSalary * 0.1); // 10% tax
    const netSalary = data.baseSalary + data.allowances + data.overtimePay + data.bonusAmount - data.deductions - taxAmount;

    const payroll = await prisma.payroll.create({
      data: {
        employeeId: data.employeeId,
        month: data.month,
        year: data.year,
        baseSalary: data.baseSalary,
        allowances: data.allowances,
        deductions: data.deductions,
        overtimePay: data.overtimePay,
        bonusAmount: data.bonusAmount,
        taxAmount,
        netSalary,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Payroll created successfully',
      data: payroll,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Payroll for this month already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create payroll',
    });
  }
});

// Get payroll records
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { employeeId, month, year, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (month) where.month = Number(month);
    if (year) where.year = Number(year);

    const records = await prisma.payroll.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.payroll.count({ where });

    res.json({
      success: true,
      data: records,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payroll records',
    });
  }
});

// Approve payroll
router.patch('/:id/approve', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), async (req: Request, res: Response) => {
  try {
    const payroll = await prisma.payroll.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED' },
    });

    res.json({
      success: true,
      message: 'Payroll approved',
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve payroll',
    });
  }
});

// Mark payroll as paid
router.patch('/:id/pay', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), async (req: Request, res: Response) => {
  try {
    const payroll = await prisma.payroll.update({
      where: { id: req.params.id },
      data: {
        status: 'PAID',
        paymentDate: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Payroll marked as paid',
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark payroll as paid',
    });
  }
});

export default router;
