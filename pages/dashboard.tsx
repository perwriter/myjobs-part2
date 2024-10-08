import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applicationCount, setApplicationCount] = useState(0);
  const [latestApplication, setLatestApplication] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchApplicationData();
    }
  }, [status, router]);

  const fetchApplicationData = async () => {
    const response = await fetch(`/api/job-applications/${session?.user?.id}`);
    if (response.ok) {
      const data = await response.json();
      setApplicationCount(data.length);
      setLatestApplication(data[0]); // Assuming the API returns sorted data with the latest first
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to your dashboard, {session.user?.name}!</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">
            <Link href="/job-applications">Job Applications</Link>
          </TabsTrigger>
          <TabsTrigger value="profile">
            <Link href="/profile">Profile</Link>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{applicationCount}</p>
              </CardContent>
            </Card>
            
            {latestApplication && (
              <Card>
                <CardHeader>
                  <CardTitle>Latest Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Company:</strong> {latestApplication.company}</p>
                  <p><strong>Job Title:</strong> {latestApplication.job_title}</p>
                  <p><strong>Date Applied:</strong> {new Date(latestApplication.date_applied).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {latestApplication.status}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}