import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/middleware/auth';
import { authorize } from '@/middleware/authorize';
import { Role } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const CreateProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  clientName: z.string(),
  clientContact: z.string().optional(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  budget: z.number(),
});

// Create project
router.post('/', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), async (req: Request, res: Response) => {
  try {
    const data = CreateProjectSchema.parse(req.body);
    const projectId = `PRJ-${Date.now()}`;

    const project = await prisma.project.create({
      data: {
        projectId,
        name: data.name,
        description: data.description,
        clientName: data.clientName,
        clientContact: data.clientContact,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        budget: data.budget,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
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
      message: 'Failed to create project',
    });
  }
});

// Get all projects
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;

    const projects = await prisma.project.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        assignments: { include: { employee: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.project.count({ where });

    res.json({
      success: true,
      data: projects,
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
      message: 'Failed to fetch projects',
    });
  }
});

// Assign employee to project
router.post('/:id/assign', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), async (req: Request, res: Response) => {
  try {
    const { employeeId, role } = req.body;

    const assignment = await prisma.projectAssignment.create({
      data: {
        projectId: req.params.id,
        employeeId,
        role: role || 'Worker',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Employee assigned to project',
      data: assignment,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Employee already assigned to this project',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to assign employee',
    });
  }
});

// Update project status
router.patch('/:id', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), async (req: Request, res: Response) => {
  try {
    const { status, progressPercentage } = req.body;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        status: status || undefined,
        progressPercentage: progressPercentage || undefined,
      },
    });

    res.json({
      success: true,
      message: 'Project updated',
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
    });
  }
});

export default router;
