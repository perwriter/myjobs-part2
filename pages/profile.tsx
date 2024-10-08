import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    const response = await fetch(`/api/profile/${session?.user?.id}`);
    if (response.ok) {
      const data = await response.json();
      setProfile(data);
      Object.keys(data).forEach((key) => {
        setValue(key, data[key]);
      });
    }
  };

  const onSubmit = async (data) => {
    const response = await fetch(`/api/profile/${session?.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Profile updated successfully');
      fetchProfile();
    } else {
      alert('Failed to update profile');
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
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="about_me">About Me</Label>
          <Textarea id="about_me" {...register('about_me')} />
        </div>
        <div>
          <Label htmlFor="industrial_field">Industrial Field</Label>
          <Input id="industrial_field" {...register('industrial_field')} />
        </div>
        <div>
          <Label htmlFor="preferred_locations">Preferred Locations</Label>
          <Input id="preferred_locations" {...register('preferred_locations')} />
        </div>
        <div>
          <Label htmlFor="preferred_job_titles">Preferred Job Titles</Label>
          <Input id="preferred_job_titles" {...register('preferred_job_titles')} />
        </div>
        <div>
          <Label htmlFor="race">Race</Label>
          <Input id="race" {...register('race')} />
        </div>
        <div>
          <Label htmlFor="salary_expectations">Salary Expectations</Label>
          <Input id="salary_expectations" {...register('salary_expectations')} />
        </div>
        <div>
          <Label htmlFor="work_environment_preference">Work Environment Preference</Label>
          <Input id="work_environment_preference" {...register('work_environment_preference')} />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
}