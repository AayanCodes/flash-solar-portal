import { Router, Request, Response } from 'express';
import { PrismaClient, LeadStatus } from '@prisma/client';
import { authenticate } from '@/middleware/auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const CreateLeadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  companyName: z.string().optional(),
  serviceInterest: z.string(),
});

// Create lead (public endpoint)
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = CreateLeadSchema.parse(req.body);

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        serviceInterest: data.serviceInterest,
        source: 'WEBSITE',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
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
      message: 'Failed to create lead',
    });
  }
});

// Get all leads (requires auth)
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;

    const leads = await prisma.lead.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.lead.count({ where });

    res.json({
      success: true,
      data: leads,
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
      message: 'Failed to fetch leads',
    });
  }
});

// Update lead status
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, followUpDate, notes } = req.body;

    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: {
        status: status || undefined,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        notes: notes || undefined,
      },
    });

    res.json({
      success: true,
      message: 'Lead updated',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
    });
  }
});

export default router;
