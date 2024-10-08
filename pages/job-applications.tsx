import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function JobApplications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchApplications();
    }
  }, [status, router]);

  const fetchApplications = async () => {
    const response = await fetch(`/api/job-applications/${session?.user?.id}`);
    if (response.ok) {
      const data = await response.json();
      setApplications(data);
    }
  };

  const onSubmit = async (data) => {
    const response = await fetch(`/api/job-applications/${session?.user?.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Job application added successfully');
      reset();
      fetchApplications();
    } else {
      alert('Failed to add job application');
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
      <h1 className="text-2xl font-bold mb-4">Job Applications</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register('company')} required />
        </div>
        <div>
          <Label htmlFor="job_title">Job Title</Label>
          <Input id="job_title" {...register('job_title')} required />
        </div>
        <div>
          <Label htmlFor="date_applied">Date Applied</Label>
          <Input id="date_applied" type="date" {...register('date_applied')} required />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Input id="status" {...register('status')} required />
        </div>
        <Button type="submit">Add Job Application</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.company}</TableCell>
              <TableCell>{app.job_title}</TableCell>
              <TableCell>{new Date(app.date_applied).toLocaleDateString()}</TableCell>
              <TableCell>{app.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}