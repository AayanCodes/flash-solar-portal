'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalEmployees: number;
  activeProjects: number;
  totalLeads: number;
  monthlyRevenue: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeProjects: 0,
    totalLeads: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        router.push('/login');
        return;
      }
      setLoading(false);
    };
    init();
  }, [token, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Flash Solar Portal</h1>
          <div className="flex gap-4">
            <span className="text-muted-foreground">{user?.firstName} {user?.lastName}</span>
            <Button
              variant="outline"
              onClick={() => {
                useAuthStore.getState().logout();
                router.push('/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{stats.totalEmployees}</div>
                <p className="text-muted-foreground mt-2">Total Employees</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary">{stats.activeProjects}</div>
                <p className="text-muted-foreground mt-2">Active Projects</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">{stats.totalLeads}</div>
                <p className="text-muted-foreground mt-2">Total Leads</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">₹{stats.monthlyRevenue}</div>
                <p className="text-muted-foreground mt-2">Monthly Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button className="w-full" variant="outline">Add Employee</Button>
                <Button className="w-full" variant="outline">New Project</Button>
                <Button className="w-full" variant="outline">View Payroll</Button>
                <Button className="w-full" variant="outline">Attendance</Button>
                <Button className="w-full" variant="outline">Manage Leads</Button>
                <Button className="w-full" variant="outline">Reports</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
