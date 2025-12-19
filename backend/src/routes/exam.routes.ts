import { Router, Response } from 'express';
import { query } from '../database/connection';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { CreateExamDto, UpdateExamDto, Exam } from '../types';

const router = Router();

// Get all exams for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM exams WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.userId]
    );

    const exams = result.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      components: row.components,
      totalPoints: parseFloat(row.total_points),
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({ success: true, data: exams });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ success: false, error: 'Failed to get exams' });
  }
});

// Get single exam
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM exams WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    const row = result.rows[0];
    const exam = {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      components: row.components,
      totalPoints: parseFloat(row.total_points),
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    res.json({ success: true, data: exam });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ success: false, error: 'Failed to get exam' });
  }
});

// Create exam
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, components, tags }: CreateExamDto = req.body;

    // Calculate total points
    const totalPoints = components.reduce((sum, comp) => {
      return sum + (('points' in comp && comp.points) ? comp.points : 0);
    }, 0);

    const result = await query(
      `INSERT INTO exams (user_id, title, components, total_points, tags) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.userId, title, JSON.stringify(components), totalPoints, tags || []]
    );

    const row = result.rows[0];
    const exam = {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      components: row.components,
      totalPoints: parseFloat(row.total_points),
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ success: false, error: 'Failed to create exam' });
  }
});

// Update exam
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, components, tags }: UpdateExamDto = req.body;

    // Calculate total points if components provided
    let totalPoints;
    if (components) {
      totalPoints = components.reduce((sum, comp) => {
        return sum + (('points' in comp && comp.points) ? comp.points : 0);
      }, 0);
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (components) {
      updates.push(`components = $${paramIndex++}`);
      values.push(JSON.stringify(components));
      updates.push(`total_points = $${paramIndex++}`);
      values.push(totalPoints);
    }
    if (tags) {
      updates.push(`tags = $${paramIndex++}`);
      values.push(tags);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id, req.userId);

    const result = await query(
      `UPDATE exams SET ${updates.join(', ')} 
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} 
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    const row = result.rows[0];
    const exam = {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      components: row.components,
      totalPoints: parseFloat(row.total_points),
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    res.json({ success: true, data: exam });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ success: false, error: 'Failed to update exam' });
  }
});

// Delete exam
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'DELETE FROM exams WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete exam' });
  }
});

export default router;
