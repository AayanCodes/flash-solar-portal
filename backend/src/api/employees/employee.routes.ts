import { Router, Request, Response } from 'express';
import { PrismaClient, EmployeeStatus } from '@prisma/client';
import { authenticate } from '@/middleware/auth';
import { authorize } from '@/middleware/authorize';
import { z } from 'zod';
import { Role } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const CreateEmployeeSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  department: z.string(),
  designation: z.string(),
  joinDate: z.string(),
  baseSalary: z.number(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  permanentAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
});

// Create employee
router.post('/', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), async (req: Request, res: Response) => {
  try {
    const data = CreateEmployeeSchema.parse(req.body);
    const employeeId = `EMP-${Date.now()}`;

    // Create user first
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: 'temp_password_change_required',
        firstName: data.firstName,
        lastName: data.lastName,
        role: Role.EMPLOYEE,
      },
    });

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        employeeId,
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        designation: data.designation,
        joinDate: new Date(data.joinDate),
        baseSalary: data.baseSalary,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        permanentAddress: data.permanentAddress,
        currentAddress: data.currentAddress,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
    });
  }
});

// Get all employees
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isDeleted: false };
    if (status) where.status = status;

    const employees = await prisma.employee.findMany({
      where,
      skip,
      take: Number(limit),
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        department: true,
        designation: true,
        joinDate: true,
        baseSalary: true,
        status: true,
      },
    });

    const total = await prisma.employee.count({ where });

    res.json({
      success: true,
      data: employees,
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
      message: 'Failed to fetch employees',
    });
  }
});

// Get employee by ID
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        documents: true,
      },
    });

    if (!employee || employee.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
    });
  }
});

// Update employee (only by admin)
router.put('/:id', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), async (req: Request, res: Response) => {
  try {
    const data = CreateEmployeeSchema.partial().parse(req.body);

    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data: {
        ...data,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
    });

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'Employee',
        entityId: employee.id,
        newValues: JSON.stringify(data),
      },
    });

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
    });
  }
});

// Soft delete employee
router.delete('/:id', authenticate, authorize(Role.SUPER_ADMIN), async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: EmployeeStatus.TERMINATED,
      },
    });

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE',
        entityType: 'Employee',
        entityId: employee.id,
      },
    });

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
    });
  }
});

export default router;
