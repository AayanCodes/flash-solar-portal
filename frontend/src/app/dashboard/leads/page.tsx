'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  status: string;
  source: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads', {
        params: {
          status: statusFilter || undefined,
        },
      });
      setLeads(response.data.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      await api.patch(`/leads/${leadId}`, { status: newStatus });
      fetchLeads();
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Lead Management</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select
            options={[
              { value: 'NEW', label: 'New' },
              { value: 'CONTACTED', label: 'Contacted' },
              { value: 'QUALIFIED', label: 'Qualified' },
              { value: 'PROPOSAL_SENT', label: 'Proposal Sent' },
              { value: 'CONVERTED', label: 'Converted' },
              { value: 'LOST', label: 'Lost' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.id}>
            <CardHeader>
              <CardTitle className="text-lg">{lead.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground"><strong>Email:</strong> {lead.email}</p>
                <p className="text-muted-foreground"><strong>Phone:</strong> {lead.phone}</p>
                <p className="text-muted-foreground"><strong>Interest:</strong> {lead.serviceInterest}</p>
                <p className="text-muted-foreground"><strong>Source:</strong> {lead.source}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {lead.status}
                </span>
                <Select
                  options={[
                    { value: 'NEW', label: 'New' },
                    { value: 'CONTACTED', label: 'Contacted' },
                    { value: 'QUALIFIED', label: 'Qualified' },
                    { value: 'CONVERTED', label: 'Converted' },
                    { value: 'LOST', label: 'Lost' },
                  ]}
                  value={lead.status}
                  onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
