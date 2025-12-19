import { Router, Response } from 'express';
import { query } from '../database/connection';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { CreateQuestionDto, QuestionBankItem } from '../types';

const router = Router();

// Get all questions from bank
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { tags, difficulty, subject } = req.query;
    
    let queryText = 'SELECT * FROM question_bank WHERE user_id = $1';
    const queryParams: any[] = [req.userId];
    let paramIndex = 2;

    if (tags && typeof tags === 'string') {
      queryText += ` AND tags && $${paramIndex++}`;
      queryParams.push(tags.split(','));
    }

    if (difficulty) {
      queryText += ` AND difficulty = $${paramIndex++}`;
      queryParams.push(difficulty);
    }

    if (subject) {
      queryText += ` AND subject = $${paramIndex++}`;
      queryParams.push(subject);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, queryParams);

    const questions = result.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      component: row.component,
      tags: row.tags,
      difficulty: row.difficulty,
      subject: row.subject,
      usageCount: row.usage_count,
      createdAt: row.created_at
    }));

    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ success: false, error: 'Failed to get questions' });
  }
});

// Add question to bank
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { component, tags, difficulty, subject }: CreateQuestionDto = req.body;

    const result = await query(
      `INSERT INTO question_bank (user_id, component, tags, difficulty, subject) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.userId, JSON.stringify(component), tags, difficulty || null, subject || null]
    );

    const row = result.rows[0];
    const question = {
      id: row.id,
      userId: row.user_id,
      component: row.component,
      tags: row.tags,
      difficulty: row.difficulty,
      subject: row.subject,
      usageCount: row.usage_count,
      createdAt: row.created_at
    };

    res.status(201).json({ success: true, data: question });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ success: false, error: 'Failed to add question' });
  }
});

// Delete question from bank
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'DELETE FROM question_bank WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete question' });
  }
});

// Increment usage count
router.post('/:id/use', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await query(
      'UPDATE question_bank SET usage_count = usage_count + 1 WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    res.json({ success: true, message: 'Usage count updated' });
  } catch (error) {
    console.error('Update usage count error:', error);
    res.status(500).json({ success: false, error: 'Failed to update usage count' });
  }
});

export default router;
