import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Profile from '../../../models/Profile';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const profile = await Profile.findOne({ where: { user_id: userId } });
      if (profile) {
        res.status(200).json(profile);
      } else {
        res.status(404).json({ error: 'Profile not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  } else if (req.method === 'PUT') {
    try {
      const [updatedRowsCount, [updatedProfile]] = await Profile.update(req.body, {
        where: { user_id: userId },
        returning: true,
      });

      if (updatedRowsCount > 0) {
        res.status(200).json(updatedProfile);
      } else {
        res.status(404).json({ error: 'Profile not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}