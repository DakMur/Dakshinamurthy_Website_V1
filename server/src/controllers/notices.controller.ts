import { Request, Response } from 'express';
import { supabase } from '../config/db.js';

// GET /api/v1/notices — public: fetch all published notices sorted newest first
export async function getPublishedNoticesHandler(req: Request, res: Response) {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, notices: data || [] });
  } catch (err: any) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notices' });
  }
}

// GET /api/v1/notices/all — admin: fetch all notices (published + unpublished)
export async function getAllNoticesHandler(req: Request, res: Response) {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, notices: data || [] });
  } catch (err: any) {
    console.error('Error fetching all notices:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notices' });
  }
}

// POST /api/v1/notices — admin: create a notice
export async function createNoticeHandler(req: Request, res: Response) {
  try {
    const { title, short_description, full_content, is_published } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Title is required (min 2 chars)' });
      return;
    }
    if (!short_description || typeof short_description !== 'string') {
      res.status(400).json({ success: false, message: 'short_description is required' });
      return;
    }
    if (!full_content || typeof full_content !== 'string') {
      res.status(400).json({ success: false, message: 'full_content is required' });
      return;
    }

    const { data, error } = await supabase
      .from('notices')
      .insert({
        title: title.trim(),
        short_description: short_description.trim(),
        full_content: full_content.trim(),
        is_published: Boolean(is_published)
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, notice: data });
  } catch (err: any) {
    console.error('Error creating notice:', err);
    res.status(500).json({ success: false, message: 'Failed to create notice' });
  }
}

// PUT /api/v1/notices/:id — admin: update a notice
export async function updateNoticeHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, short_description, full_content, is_published } = req.body;

    const updateData: any = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title.trim();
    if (short_description !== undefined) updateData.short_description = short_description.trim();
    if (full_content !== undefined) updateData.full_content = full_content.trim();
    if (is_published !== undefined) updateData.is_published = Boolean(is_published);

    const { data, error } = await supabase
      .from('notices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ success: false, message: 'Notice not found' });
      return;
    }

    res.json({ success: true, notice: data });
  } catch (err: any) {
    console.error('Error updating notice:', err);
    res.status(500).json({ success: false, message: 'Failed to update notice' });
  }
}

// DELETE /api/v1/notices/:id — admin: delete a notice
export async function deleteNoticeHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting notice:', err);
    res.status(500).json({ success: false, message: 'Failed to delete notice' });
  }
}
