'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
}

export default function PayrollPage() {
  const [records, setRecords] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    fetchPayroll();
  }, [month, year]);

  const fetchPayroll = async () => {
    try {
      const response = await api.get('/payroll', {
        params: {
          month: month || undefined,
          year: year || undefined,
        },
      });
      setRecords(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (payrollId: string) => {
    try {
      await api.patch(`/payroll/${payrollId}/approve`);
      fetchPayroll();
    } catch (error) {
      console.error('Failed to approve payroll:', error);
    }
  };

  const handlePay = async (payrollId: string) => {
    try {
      await api.patch(`/payroll/${payrollId}/pay`);
      fetchPayroll();
    } catch (error) {
      console.error('Failed to mark payroll as paid:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Payroll Management</h1>
        <div className="flex gap-4">
          <Select
            options={[
              { value: '1', label: 'January' },
              { value: '2', label: 'February' },
              { value: '3', label: 'March' },
              { value: '4', label: 'April' },
              { value: '5', label: 'May' },
              { value: '6', label: 'June' },
              { value: '7', label: 'July' },
              { value: '8', label: 'August' },
              { value: '9', label: 'September' },
              { value: '10', label: 'October' },
              { value: '11', label: 'November' },
              { value: '12', label: 'December' },
            ]}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <Select
            options={[
              { value: '2024', label: '2024' },
              { value: '2025', label: '2025' },
              { value: '2026', label: '2026' },
            ]}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <Button>Generate Payroll</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3">Employee</th>
                  <th className="text-left p-3">Period</th>
                  <th className="text-right p-3">Base Salary</th>
                  <th className="text-right p-3">Allowances</th>
                  <th className="text-right p-3">Deductions</th>
                  <th className="text-right p-3">Net Salary</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3">Employee {record.employeeId.substring(0, 5)}</td>
                    <td className="p-3">{record.month}/{record.year}</td>
                    <td className="text-right p-3">₹{record.baseSalary.toLocaleString()}</td>
                    <td className="text-right p-3">₹{record.allowances.toLocaleString()}</td>
                    <td className="text-right p-3">₹{record.deductions.toLocaleString()}</td>
                    <td className="text-right p-3 font-semibold">₹{record.netSalary.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.status === 'PAID' ? 'bg-green-500/10 text-green-700' :
                        record.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-700' :
                        'bg-yellow-500/10 text-yellow-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      {record.status === 'PENDING' && (
                        <Button variant="ghost" size="sm" onClick={() => handleApprove(record.id)}>Approve</Button>
                      )}
                      {record.status === 'APPROVED' && (
                        <Button variant="ghost" size="sm" onClick={() => handlePay(record.id)}>Pay</Button>
                      )}
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
