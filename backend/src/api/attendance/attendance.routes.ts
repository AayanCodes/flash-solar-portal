import { Router, Request, Response } from 'express';
import { PrismaClient, AttendanceStatus } from '@prisma/client';
import { authenticate } from '@/middleware/auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const CheckInSchema = z.object({
  employeeId: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const CheckOutSchema = z.object({
  employeeId: z.string(),
});

// Check in
router.post('/check-in', authenticate, async (req: Request, res: Response) => {
  try {
    const data = CheckInSchema.parse(req.body);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: data.employeeId,
          date: today,
        },
      },
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today',
      });
    }

    const checkInTime = new Date();
    const status = checkInTime.getHours() > 9 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: data.employeeId,
          date: today,
        },
      },
      update: {
        checkInTime,
        status,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      create: {
        employeeId: data.employeeId,
        date: today,
        checkInTime,
        status,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    res.json({
      success: true,
      message: 'Check in successful',
      data: attendance,
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
      message: 'Check in failed',
    });
  }
});

// Check out
router.post('/check-out', authenticate, async (req: Request, res: Response) => {
  try {
    const data = CheckOutSchema.parse(req.body);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: data.employeeId,
          date: today,
        },
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No check in record found for today',
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today',
      });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOutTime: new Date() },
    });

    res.json({
      success: true,
      message: 'Check out successful',
      data: updatedAttendance,
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
      message: 'Check out failed',
    });
  }
});

// Get attendance records
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { employeeId, startDate, endDate, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const records = await prisma.attendance.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { date: 'desc' },
    });

    const total = await prisma.attendance.count({ where });

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
      message: 'Failed to fetch attendance records',
    });
  }
});

export default router;
