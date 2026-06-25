'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance', {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
      setRecords(response.data.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (employeeId: string) => {
    try {
      await api.post('/attendance/check-in', {
        employeeId,
      });
      fetchAttendance();
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const handleCheckOut = async (employeeId: string) => {
    try {
      await api.post('/attendance/check-out', {
        employeeId,
      });
      fetchAttendance();
    } catch (error) {
      console.error('Check-out failed:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Attendance</h1>
        <div className="flex gap-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <Button onClick={fetchAttendance}>Filter</Button>
          <Button variant="outline">Export to CSV</Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Check In</th>
                  <th className="text-left p-3">Check Out</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Duration</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="p-3">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                    <td className="p-3">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-700">
                        {record.status}
                      </span>
                    </td>
                    <td className="p-3">8h 30m</td>
                    <td className="p-3 space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleCheckIn(record.employeeId)}>Check In</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleCheckOut(record.employeeId)}>Check Out</Button>
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
