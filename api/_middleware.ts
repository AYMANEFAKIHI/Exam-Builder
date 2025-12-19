import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: VercelRequest): { userId: string; email: string } | null => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
      userId: string;
      email: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};

export const withAuth = (
  handler: (req: VercelRequest, res: VercelResponse, user: { userId: string; email: string }) => Promise<void>
) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return handler(req, res, user);
  };
};
