'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, Mail, Phone } from 'lucide-react';

interface Application {
  id: string;
  property_id: string;
  applicant_id: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  property: {
    title: string;
    address: string;
  };
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Fetch applications made by the current user
        const { data: sentApplications, error: sentError } = await supabase
          .from('property_applications')
          .select(`
            *,
            property:properties(title, address)
          `)
          .eq('applicant_id', user.id)
          .order('created_at', { ascending: false });

        if (sentError) throw sentError;

        // Fetch applications received for user's properties
        const { data: receivedApps, error: receivedError } = await supabase
          .from('property_applications')
          .select(`
            *,
            property:properties!inner(title, address, owner_id)
          `)
          .eq('property.owner_id', user.id) // Ensure the join is explicit and filters by owner_id
          .order('created_at', { ascending: false });

        if (receivedError) throw receivedError;

        setApplications(sentApplications || []);
        setReceivedApplications(receivedApps || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      console.log(`Updating application ID: ${applicationId} to status: ${newStatus}`); // Debug log
      const { error } = await supabase
        .from('property_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      if (error) {
        console.error('Supabase error:', error.message); // Log error
        setError(`Failed to update status: ${error.message}`); // Set error state
        return;
      }
      console.log('Status updated successfully in Supabase'); // Debug log

      // Update local state
      setReceivedApplications(prev => {
        const updated = prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        );
        console.log('Updated state:', updated); // Debug log
        return updated;
      });
    } catch (error: any) {
      console.error('Error updating application status:', error);
      setError('An unexpected error occurred while updating the status.'); // Set error state
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Applications Received */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Applications Received</h2>
        {receivedApplications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No applications received yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {receivedApplications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <CardTitle>{application.property?.title || 'No Title Available'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{application.property?.address || 'No Address Available'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{application.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{application.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(application.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p>{application.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          console.log('Approve button clicked for application ID:', application.id); // Debug log
                          handleUpdateStatus(application.id, 'approved');
                        }}
                        disabled={application.status === 'approved'}
                        className="flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          console.log('Reject button clicked for application ID:', application.id); // Debug log
                          handleUpdateStatus(application.id, 'rejected');
                        }}
                        disabled={application.status === 'rejected'}
                        variant="destructive"
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Applications Sent */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Your Applications</h2>
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You haven't submitted any applications yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <CardTitle>{application.property?.title || 'No Title Available'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{application.property?.address || 'No Address Available'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(application.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p>{application.message}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <span className={`capitalize font-semibold ${
                        application.status === 'approved' ? 'text-green-600' :
                        application.status === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}