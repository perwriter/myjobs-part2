import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import JobApplication from '../../../models/JobApplication';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const applications = await JobApplication.findAll({ where: { user_id: userId } });
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch job applications' });
    }
  } else if (req.method === 'POST') {
    try {
      const newApplication = await JobApplication.create({
        ...req.body,
        user_id: userId,
      });
      res.status(201).json(newApplication);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create job application' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}