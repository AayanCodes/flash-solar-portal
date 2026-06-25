# Database Schema Documentation

## Overview
The Flash Solar Portal uses PostgreSQL as the primary database with Prisma ORM for data management.

## Database Models

### User
Represents system users with authentication credentials.

**Fields:**
- `id` (String, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `role` (Enum: SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE)
- `isActive` (Boolean, Default: true)
- `profilePhoto` (String, Optional)
- `lastLogin` (DateTime, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Employee
Detailed employee information and records.

**Fields:**
- `id` (String, Primary Key)
- `employeeId` (String, Unique)
- `userId` (String, Foreign Key to User)
- Personal Information
  - `firstName`, `lastName`
  - `fatherName`, `motherName`
  - `gender`, `dateOfBirth`
  - `bloodGroup`, `maritalStatus`
  - `nationality`
- Contact Information
  - `phone`, `alternatePhone`
  - `email`
  - `permanentAddress`, `currentAddress`
- Employment Information
  - `joinDate`
  - `department`, `designation`
  - `employmentType`
  - `experience`, `reportingManager`
  - `skills`, `qualification`
- Financial Information
  - `baseSalary`
  - `bankName`, `accountNumber`
  - `ifscCode`, `upiId`
- Documents
  - `aadhaar`, `pan`
  - `passportNumber`, `drivingLicense`
- Status
  - `status` (Enum: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED)
  - `isDeleted` (Boolean)
  - `deletedAt` (DateTime, Optional)
- `createdAt`, `updatedAt`

### Attendance
Daily attendance records for employees.

**Fields:**
- `id` (String, Primary Key)
- `employeeId` (String, Foreign Key)
- `date` (DateTime, Unique with employeeId)
- `checkInTime` (DateTime, Optional)
- `checkOutTime` (DateTime, Optional)
- `status` (Enum: PRESENT, ABSENT, LATE, HALF_DAY, WORK_FROM_HOME)
- `latitude` (Float, Optional)
- `longitude` (Float, Optional)
- `notes` (String, Optional)
- `createdAt`, `updatedAt`

### Payroll
Payroll records for salary management.

**Fields:**
- `id` (String, Primary Key)
- `employeeId` (String, Foreign Key)
- `month` (Int, 1-12)
- `year` (Int)
- `baseSalary` (Float)
- `allowances` (Float, Default: 0)
- `deductions` (Float, Default: 0)
- `overtimePay` (Float, Default: 0)
- `bonusAmount` (Float, Default: 0)
- `taxAmount` (Float)
- `netSalary` (Float)
- `status` (Enum: PENDING, APPROVED, PAID, REJECTED)
- `paymentDate` (DateTime, Optional)
- `notes` (String, Optional)
- `createdAt`, `updatedAt`
- **Unique Constraint**: (employeeId, month, year)

### Project
Project tracking and management.

**Fields:**
- `id` (String, Primary Key)
- `projectId` (String, Unique)
- `name` (String)
- `description` (String, Optional)
- `clientName` (String)
- `clientContact` (String, Optional)
- `location` (String)
- `startDate` (DateTime)
- `endDate` (DateTime, Optional)
- `budget` (Float)
- `status` (Enum: PLANNING, IN_PROGRESS, COMPLETED, ON_HOLD, CANCELLED)
- `progressPercentage` (Int, Default: 0)
- `notes` (String, Optional)
- `createdAt`, `updatedAt`

### ProjectAssignment
Worker assignments to projects.

**Fields:**
- `id` (String, Primary Key)
- `projectId` (String, Foreign Key)
- `employeeId` (String, Foreign Key)
- `role` (String)
- `assignedDate` (DateTime)
- `status` (String, Default: "ACTIVE")
- `createdAt`, `updatedAt`
- **Unique Constraint**: (projectId, employeeId)

### Lead
Lead management for CRM.

**Fields:**
- `id` (String, Primary Key)
- `name` (String)
- `email` (String)
- `phone` (String)
- `companyName` (String, Optional)
- `serviceInterest` (String)
- `source` (Enum: WEBSITE, REFERRAL, SOCIAL_MEDIA, EMAIL, PHONE_CALL, OTHER)
- `status` (Enum: NEW, CONTACTED, QUALIFIED, PROPOSAL_SENT, NEGOTIATION, CONVERTED, LOST)
- `followUpDate` (DateTime, Optional)
- `notes` (String, Optional)
- `convertedToCustomer` (Boolean, Default: false)
- `createdAt`, `updatedAt`

### AuditLog
Audit trail for compliance and monitoring.

**Fields:**
- `id` (String, Primary Key)
- `userId` (String, Foreign Key)
- `employeeId` (String, Optional)
- `action` (String)
- `entityType` (String)
- `entityId` (String)
- `oldValues` (String, JSON)
- `newValues` (String, JSON)
- `ipAddress` (String, Optional)
- `userAgent` (String, Optional)
- `createdAt` (DateTime)

## Relationships

```
User (1) ──────────── (1) Employee
User (1) ──────────── (M) AuditLog

Employee (1) ──────────── (M) Attendance
Employee (1) ──────────── (M) Payroll
Employee (1) ──────────── (M) ProjectAssignment
Employee (1) ──────────── (M) EmployeeDocument

Project (1) ──────────── (M) ProjectAssignment
Project (1) ──────────── (M) ProjectTask
```

## Indexes

For optimal query performance:
- `User.email` (Unique)
- `Employee.employeeId` (Unique)
- `Employee.userId` (Unique)
- `Attendance.employeeId_date` (Unique)
- `Payroll.employeeId_month_year` (Unique)
- `Project.projectId` (Unique)
- `ProjectAssignment.projectId_employeeId` (Unique)

## Enums

### Role
- SUPER_ADMIN
- ADMIN
- MANAGER
- EMPLOYEE

### EmployeeStatus
- ACTIVE
- INACTIVE
- ON_LEAVE
- TERMINATED

### AttendanceStatus
- PRESENT
- ABSENT
- LATE
- HALF_DAY
- WORK_FROM_HOME

### PayrollStatus
- PENDING
- APPROVED
- PAID
- REJECTED

### ProjectStatus
- PLANNING
- IN_PROGRESS
- COMPLETED
- ON_HOLD
- CANCELLED

### TaskStatus
- PENDING
- IN_PROGRESS
- COMPLETED
- CANCELLED

### LeadSource
- WEBSITE
- REFERRAL
- SOCIAL_MEDIA
- EMAIL
- PHONE_CALL
- OTHER

### LeadStatus
- NEW
- CONTACTED
- QUALIFIED
- PROPOSAL_SENT
- NEGOTIATION
- CONVERTED
- LOST
