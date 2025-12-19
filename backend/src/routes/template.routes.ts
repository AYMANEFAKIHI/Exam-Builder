import { Router, Response } from 'express';
import { query } from '../database/connection';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { Template } from '../types';

const router = Router();

// Get all templates (user's own + public)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM templates WHERE user_id = $1 OR is_public = true ORDER BY created_at DESC',
      [req.userId]
    );

    const templates = result.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      headerComponent: row.header_component,
      isPublic: row.is_public,
      usageCount: row.usage_count,
      createdAt: row.created_at
    }));

    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ success: false, error: 'Failed to get templates' });
  }
});

// Create template
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, headerComponent, isPublic } = req.body;

    const result = await query(
      `INSERT INTO templates (user_id, name, description, header_component, is_public) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.userId, name, description || null, JSON.stringify(headerComponent), isPublic || false]
    );

    const row = result.rows[0];
    const template = {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      headerComponent: row.header_component,
      isPublic: row.is_public,
      usageCount: row.usage_count,
      createdAt: row.created_at
    };

    res.status(201).json({ success: true, data: template });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ success: false, error: 'Failed to create template' });
  }
});

// Delete template
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'DELETE FROM templates WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }

    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete template' });
  }
});

// Increment usage count
router.post('/:id/use', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await query(
      'UPDATE templates SET usage_count = usage_count + 1 WHERE id = $1',
      [req.params.id]
    );

    res.json({ success: true, message: 'Usage count updated' });
  } catch (error) {
    console.error('Update usage count error:', error);
    res.status(500).json({ success: false, error: 'Failed to update usage count' });
  }
});

export default router;
