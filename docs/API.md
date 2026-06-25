# API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All protected endpoints require Bearer token authentication:
```
Authorization: Bearer {accessToken}
```

## Endpoints

### Authentication

#### Register
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

#### Login
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": { ... },
      "accessToken": "eyJhbGc..."
    }
  }
  ```

#### Get Current User
- **GET** `/auth/me`
- **Auth Required**: Yes

### Employees

#### Create Employee
- **POST** `/employees`
- **Auth Required**: Yes (Admin/Super Admin)
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "department": "Engineering",
    "designation": "Senior Developer",
    "joinDate": "2024-01-15",
    "baseSalary": 50000
  }
  ```

#### List Employees
- **GET** `/employees?page=1&limit=10&status=ACTIVE`
- **Auth Required**: Yes
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Records per page (default: 10)
  - `status`: Filter by status (ACTIVE, INACTIVE, ON_LEAVE, TERMINATED)

#### Get Employee
- **GET** `/employees/:id`
- **Auth Required**: Yes

#### Update Employee
- **PUT** `/employees/:id`
- **Auth Required**: Yes (Admin/Super Admin)

#### Delete Employee
- **DELETE** `/employees/:id`
- **Auth Required**: Yes (Super Admin only)

### Attendance

#### Check In
- **POST** `/attendance/check-in`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "employeeId": "emp-123",
    "latitude": 28.5355,
    "longitude": 77.3910
  }
  ```

#### Check Out
- **POST** `/attendance/check-out`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "employeeId": "emp-123"
  }
  ```

#### Get Attendance Records
- **GET** `/attendance?employeeId=emp-123&startDate=2024-01-01&endDate=2024-01-31`
- **Auth Required**: Yes
- **Query Params**:
  - `employeeId`: Filter by employee
  - `startDate`: Start date (YYYY-MM-DD)
  - `endDate`: End date (YYYY-MM-DD)
  - `page`: Page number
  - `limit`: Records per page

### Payroll

#### Create Payroll
- **POST** `/payroll`
- **Auth Required**: Yes (Admin/Super Admin)
- **Body**:
  ```json
  {
    "employeeId": "emp-123",
    "month": 1,
    "year": 2024,
    "baseSalary": 50000,
    "allowances": 5000,
    "deductions": 2000,
    "overtimePay": 1000,
    "bonusAmount": 5000
  }
  ```

#### List Payroll
- **GET** `/payroll?employeeId=emp-123&month=1&year=2024&page=1&limit=10`
- **Auth Required**: Yes

#### Approve Payroll
- **PATCH** `/payroll/:id/approve`
- **Auth Required**: Yes (Admin/Super Admin)

#### Mark as Paid
- **PATCH** `/payroll/:id/pay`
- **Auth Required**: Yes (Admin/Super Admin)

### Projects

#### Create Project
- **POST** `/projects`
- **Auth Required**: Yes (Admin/Manager/Super Admin)
- **Body**:
  ```json
  {
    "name": "Solar Installation - Downtown",
    "description": "Large scale solar installation",
    "clientName": "ABC Corporation",
    "location": "Downtown Area",
    "startDate": "2024-01-15",
    "budget": 500000
  }
  ```

#### List Projects
- **GET** `/projects?status=IN_PROGRESS&page=1&limit=10`
- **Auth Required**: Yes

#### Assign Employee
- **POST** `/projects/:id/assign`
- **Auth Required**: Yes (Admin/Manager/Super Admin)
- **Body**:
  ```json
  {
    "employeeId": "emp-123",
    "role": "Senior Technician"
  }
  ```

#### Update Project
- **PATCH** `/projects/:id`
- **Auth Required**: Yes (Admin/Manager/Super Admin)
- **Body**:
  ```json
  {
    "status": "IN_PROGRESS",
    "progressPercentage": 50
  }
  ```

### Leads

#### Create Lead (Public)
- **POST** `/leads`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "companyName": "ABC Corporation",
    "serviceInterest": "Solar Panel Installation"
  }
  ```

#### List Leads
- **GET** `/leads?status=NEW&page=1&limit=10`
- **Auth Required**: Yes

#### Update Lead
- **PATCH** `/leads/:id`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "status": "QUALIFIED",
    "followUpDate": "2024-02-01",
    "notes": "Follow up with client"
  }
  ```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Status Codes
- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
