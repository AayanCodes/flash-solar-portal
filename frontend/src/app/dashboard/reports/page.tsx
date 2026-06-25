'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

export default function ReportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Reports</h1>
        <div className="flex gap-4">
          <Select
            options={[
              { value: 'attendance', label: 'Attendance Report' },
              { value: 'payroll', label: 'Payroll Report' },
              { value: 'employee', label: 'Employee Report' },
              { value: 'project', label: 'Project Report' },
            ]}
            className="max-w-xs"
          />
          <Button>Generate Report</Button>
          <Button variant="outline">Export to PDF</Button>
          <Button variant="outline">Export to Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Employees:</span>
                <span className="font-semibold">45</span>
              </div>
              <div className="flex justify-between">
                <span>Present Today:</span>
                <span className="font-semibold text-green-600">42</span>
              </div>
              <div className="flex justify-between">
                <span>Absent:</span>
                <span className="font-semibold text-red-600">2</span>
              </div>
              <div className="flex justify-between">
                <span>On Leave:</span>
                <span className="font-semibold text-yellow-600">1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Solar Installation - Downtown</span>
                  <span className="text-sm font-semibold">75%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Solar Installation - Uptown</span>
                  <span className="text-sm font-semibold">50%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Payroll:</span>
                <span className="font-semibold">₹15,00,000</span>
              </div>
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-semibold text-green-600">₹50,00,000</span>
              </div>
              <div className="flex justify-between">
                <span>Net Profit:</span>
                <span className="font-semibold text-green-600">₹25,00,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Leads:</span>
                <span className="font-semibold">120</span>
              </div>
              <div className="flex justify-between">
                <span>Converted:</span>
                <span className="font-semibold text-green-600">35</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-semibold">29.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
