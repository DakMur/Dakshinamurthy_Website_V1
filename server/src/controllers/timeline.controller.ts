import { Request, Response } from 'express';
import { supabase } from '../config/db.js';

// ── PUBLIC: GET /api/v1/timeline ────────────────────────────────────────────
// Returns only published timeline phases, ordered by display_order ASC.
export async function getTimelineHandler(req: Request, res: Response) {
  try {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    res.json({ success: true, timeline: data || [] });
  } catch (err: any) {
    console.error('getTimelineHandler error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch timeline' });
  }
}

// ── ADMIN: GET /api/v1/timeline/admin ───────────────────────────────────────
// Returns ALL phases (published + unpublished), ordered by display_order ASC.
export async function getAdminTimelineHandler(req: Request, res: Response) {
  try {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    res.json({ success: true, timeline: data || [] });
  } catch (err: any) {
    console.error('getAdminTimelineHandler error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch timeline' });
  }
}

// ── ADMIN: POST /api/v1/timeline ────────────────────────────────────────────
export async function createTimelineHandler(req: Request, res: Response) {
  try {
    const {
      phase_number, phase_tag, title, quote,
      description, date_text, display_order, is_published
    } = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json({ success: false, message: 'title is required.' });
      return;
    }

    const { data, error } = await supabase
      .from('timeline')
      .insert({
        phase_number: phase_number ?? null,
        phase_tag: phase_tag?.trim() ?? null,
        title: title.trim(),
        quote: quote?.trim() ?? null,
        description: description?.trim() ?? null,
        date_text: date_text?.trim() ?? null,
        display_order: display_order ?? 999,
        is_published: is_published ?? false,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, item: data });
  } catch (err: any) {
    console.error('createTimelineHandler error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create timeline item' });
  }
}

// ── ADMIN: PUT /api/v1/timeline/reorder ────────────────────────────────────
// Body: { items: Array<{ id: string|number, display_order: number }> }
export async function reorderTimelineHandler(req: Request, res: Response) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'items array is required.' });
      return;
    }

    // Batch-update each item's display_order
    const updates = items.map(({ id, display_order }: { id: string | number; display_order: number }) =>
      supabase
        .from('timeline')
        .update({ display_order })
        .eq('id', id)
    );

    await Promise.all(updates);
    res.json({ success: true });
  } catch (err: any) {
    console.error('reorderTimelineHandler error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to reorder timeline' });
  }
}

// ── ADMIN: PUT /api/v1/timeline/:id ────────────────────────────────────────
export async function updateTimelineHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      phase_number, phase_tag, title, quote,
      description, date_text, display_order, is_published
    } = req.body;

    const updatePayload: Record<string, any> = {};
    if (phase_number !== undefined) updatePayload.phase_number = phase_number;
    if (phase_tag !== undefined) updatePayload.phase_tag = phase_tag;
    if (title !== undefined) updatePayload.title = title;
    if (quote !== undefined) updatePayload.quote = quote;
    if (description !== undefined) updatePayload.description = description;
    if (date_text !== undefined) updatePayload.date_text = date_text;
    if (display_order !== undefined) updatePayload.display_order = display_order;
    if (is_published !== undefined) updatePayload.is_published = is_published;

    const { data, error } = await supabase
      .from('timeline')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, item: data });
  } catch (err: any) {
    console.error('updateTimelineHandler error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update timeline item' });
  }
}

// ── ADMIN: DELETE /api/v1/timeline/:id ─────────────────────────────────────
export async function deleteTimelineHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('timeline')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error('deleteTimelineHandler error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to delete timeline item' });
  }
}
