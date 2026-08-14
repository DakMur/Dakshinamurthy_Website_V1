import { Request, Response } from 'express';
import { supabase } from '../config/db.js';
import { s3Client } from '../config/storage.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import busboy from 'busboy';
import crypto from 'crypto';
import path from 'path';
import jwt from 'jsonwebtoken';

function validateAndSanitizeMembers(members: any[]) {
  if (!Array.isArray(members) || members.length === 0 || members.length > 5) {
    throw new Error('Team must have between 1 and 5 members.');
  }
  return members.map((m: any) => {
    const name = m.name?.toString().trim() || '';
    const email = m.email?.toString().trim() || '';
    const phone = m.phone?.toString().trim() || '';
    const college_name = m.college_name?.toString().trim() || null;
    const semester = m.semester ? parseInt(m.semester, 10) : null;

    if (!name || name.length < 2 || name.length > 100) throw new Error('Invalid member name.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Invalid email: ${email}`);
    if (!phone || !/^\+?[0-9\s\-]{7,15}$/.test(phone)) throw new Error(`Invalid phone format: ${phone}`);
    if (semester !== null && (isNaN(semester) || semester < 1 || semester > 8)) {
      throw new Error(`Invalid semester value for ${name}. Must be 1–8.`);
    }

    return { name, email, phone, college_name, semester };
  });
}

export async function checkDuplicatesHandler(req: Request, res: Response) {
  try {
    const { email, phone, teamName } = req.body;
    if (!email && !phone && !teamName) {
      res.json({ isDuplicate: false });
      return;
    }

    let teamDup = null;
    if (teamName) {
      const { data, error } = await supabase
        .from('teams')
        .select('id')
        .eq('team_name', teamName);
      if (error) throw error;
      teamDup = data;
    }

    const memberConditions: string[] = [];
    if (email) memberConditions.push(`email.eq.${email}`);
    if (phone) memberConditions.push(`phone.eq.${phone}`);

    let memberDup = null;
    if (memberConditions.length > 0) {
      const { data, error } = await supabase
        .from('members')
        .select('id')
        .or(memberConditions.join(','));
      if (error) throw error;
      memberDup = data;
    }

    const isDuplicate = (teamDup && teamDup.length > 0) || (memberDup && memberDup.length > 0);
    res.json({ isDuplicate });
  } catch (err: any) {
    console.error('Error checking duplicates:', err);
    res.status(500).json({ error: 'Database verification failed' });
  }
}

export async function signupHandler(req: Request, res: Response) {
  try {
    const { teamName, leaderEmail, leaderPhone, members, documentUrl } = req.body;

    if (!teamName || typeof teamName !== 'string' || teamName.trim().length < 2 || teamName.trim().length > 50) {
      res.status(400).json({ success: false, message: 'Invalid team name length' });
      return;
    }
    const sanitizedTeamName = teamName.trim();

    let sanitizedMembers;
    try {
      sanitizedMembers = validateAndSanitizeMembers(members);
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
      return;
    }

    // Server-side duplicate check across all submitted members
    const emails = sanitizedMembers.map((m: any) => m.email);
    const phones = sanitizedMembers.map((m: any) => m.phone);
    const uniqueEmails = new Set(emails);
    const uniquePhones = new Set(phones);
    if (uniqueEmails.size !== emails.length || uniquePhones.size !== phones.length) {
      res.status(400).json({ success: false, message: 'Duplicate email or phone number found within the team.' });
      return;
    }

    // Check existing DB records for email/phone collision
    const emailConditions = emails.map((e: string) => `email.eq.${e}`).join(',');
    const phoneConditions = phones.map((p: string) => `phone.eq.${p}`).join(',');
    const { data: existingMembers } = await supabase
      .from('members')
      .select('id')
      .or(`${emailConditions},${phoneConditions}`);
    if (existingMembers && existingMembers.length > 0) {
      res.status(400).json({ success: false, message: 'One or more email/phone numbers are already registered.' });
      return;
    }

    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .insert({
        team_name: sanitizedTeamName,
        file_url: documentUrl || null
      })
      .select()
      .single();

    if (teamError) throw teamError;

    const teamId = teamData.id;

    const membersToInsert = sanitizedMembers.map((m: any, index: number) => ({
      team_id: teamId,
      name: m.name,
      email: m.email,
      phone: m.phone,
      college_name: m.college_name,
      semester: m.semester,
      role: index === 0 ? 'leader' : 'member'
    }));

    const { error: membersError } = await supabase
      .from('members')
      .insert(membersToInsert);

    if (membersError) {
      // Rollback team creation if members insertion fails
      await supabase.from('teams').delete().eq('id', teamId);
      throw membersError;
    }

    const responseTeam = {
      id: teamId,
      teamName: teamData.team_name,
      leaderEmail: sanitizedMembers[0].email,
      leaderPhone: sanitizedMembers[0].phone,
      documentUrl: teamData.file_url,
      members: sanitizedMembers
    };

    res.status(201).json({ success: true, team: responseTeam });
  } catch (err: any) {
    console.error('Error during signup:', err);
    res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const adminEmailEnv = process.env.ADMIN_EMAIL;
    const adminPassEnv = process.env.ADMIN_PASSWORD;

    const isEnvAdmin = adminEmailEnv && adminPassEnv && email === adminEmailEnv && password === adminPassEnv;
    const isFallbackAdmin1 = email === 'admin@dakshina.org' && password === 'admin_secure_2026';
    const isFallbackAdmin2 = email === 'falconace81@gmail.com' && password === 'dakshinaasya2026';

    if (isEnvAdmin || isFallbackAdmin1 || isFallbackAdmin2) {
      const adminEmail = isEnvAdmin ? adminEmailEnv : email;
      const token = jwt.sign(
        { email: adminEmail, role: 'ADMIN', isAdmin: true },
        process.env.JWT_SECRET || 'default_jwt_secret_2026',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        // TODO(security): Harden by removing fallback credentials and using env vars only.
        admin: true,
        message: 'Admin login successful',
        token: token,
        user: { email: adminEmail, role: 'ADMIN' }
      });
    }

    const { data: configData } = await supabase
      .from('admin_config')
      .select('disable_team_login')
      .eq('id', 1)
      .maybeSingle();

    if (configData?.disable_team_login) {
      res.status(403).json({ success: false, message: 'System Access Paused by Administration.' });
      return;
    }

    const { data: leaderMember, error: leaderError } = await supabase
      .from('members')
      .select('team_id')
      .eq('email', email)
      .eq('phone', password)
      .eq('role', 'leader')
      .maybeSingle();

    if (leaderError) throw leaderError;

    if (!leaderMember) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', leaderMember.team_id)
      .single();

    if (teamError) throw teamError;

    const { data: membersData, error: membersError } = await supabase
      .from('members')
      .select('*')
      .eq('team_id', leaderMember.team_id);

    if (membersError) throw membersError;

    const responseTeam = {
      id: teamData.id,
      teamName: teamData.team_name,
      leaderEmail: email,
      leaderPhone: password,
      documentUrl: teamData.file_url,
      demoVideoUrl: teamData.demo_video_url,
      passed_round: teamData.passed_round,
      members: membersData.map((m: any) => ({
        name: m.name,
        email: m.email,
        phone: m.phone,
        college_name: m.college_name || '',
        semester: m.semester || null
      }))
    };

    res.json({ success: true, team: responseTeam });
  } catch (err: any) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
}

export async function getConfigHandler(req: Request, res: Response) {
  const FALLBACK_CONFIG = {
    status: 'Registration Open' as const,
    minMembers: 2,
    maxMembers: 4,
    disableTeamLogin: false,
    openDate: null,
    closeDate: null,
    countdownTarget: null,
    allowDocumentUpload: true,
    allowMemberEdits: true,
  };

  try {
    const { data, error } = await supabase
      .from('admin_config')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    // If DB query errored OR returned no rows, return a safe fallback — never 500
    if (error || !data) {
      if (error) console.warn('getConfigHandler: DB error, serving fallback config:', error.message);
      else console.warn('getConfigHandler: No admin_config row found, serving fallback config.');
      return res.status(200).json(FALLBACK_CONFIG);
    }

    let statusString: 'Registration Not Yet Opened' | 'Registration Open' | 'Registrations Closed' = 'Registration Not Yet Opened';
    if (data.phase === 1) statusString = 'Registration Open';
    else if (data.phase === 2) statusString = 'Registrations Closed';

    res.json({
      status: statusString,
      openDate: data.phase === 0 ? data.countdown_target : null,
      closeDate: data.close_date || (data.phase === 1 ? data.countdown_target : null),
      countdownTarget: data.countdown_target,
      minMembers: data.min_members ?? FALLBACK_CONFIG.minMembers,
      maxMembers: data.max_members ?? FALLBACK_CONFIG.maxMembers,
      disableTeamLogin: data.disable_team_login ?? false,
      allowDocumentUpload: data.allow_document_upload ?? true,
      allowMemberEdits: data.allow_member_edits ?? true,
    });
  } catch (err: any) {
    console.warn('getConfigHandler: Unexpected error, serving fallback config:', err?.message);
    // Never expose a 500 to public visitors — fall back gracefully
    return res.status(200).json(FALLBACK_CONFIG);
  }
}

export async function updateConfigHandler(req: Request, res: Response) {
  try {
    const config = req.body;
    const updateData: any = {};
    
    let phase = undefined;
    if (config.status !== undefined) {
      if (config.status === 'Registration Not Yet Opened') phase = 0;
      else if (config.status === 'Registration Open') phase = 1;
      else phase = 2;
      updateData.phase = phase;
    }

    if (config.openDate !== undefined && (phase === 0 || config.status === 'Registration Not Yet Opened')) {
      updateData.countdown_target = config.openDate === "" ? null : config.openDate;
    }
    
    if (config.closeDate !== undefined && (phase === 1 || config.status === 'Registration Open')) {
      updateData.close_date = config.closeDate === "" ? null : config.closeDate;
      updateData.countdown_target = config.closeDate === "" ? null : config.closeDate;
    } else if (config.countdownTarget !== undefined && phase === 1) {
      updateData.close_date = config.countdownTarget === "" ? null : config.countdownTarget;
      updateData.countdown_target = config.countdownTarget === "" ? null : config.countdownTarget;
    }

    if (config.minMembers !== undefined) updateData.min_members = config.minMembers;
    if (config.maxMembers !== undefined) updateData.max_members = config.maxMembers;
    if (config.disableTeamLogin !== undefined) updateData.disable_team_login = config.disableTeamLogin;
    if (config.allowDocumentUpload !== undefined) updateData.allow_document_upload = config.allowDocumentUpload;
    if (config.allowMemberEdits !== undefined) updateData.allow_member_edits = config.allowMemberEdits;

    const { data, error } = await supabase
      .from('admin_config')
      .upsert({ id: 1, ...updateData }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    let statusString = 'Registration Not Yet Opened';
    if (data.phase === 1) statusString = 'Registration Open';
    else if (data.phase === 2) statusString = 'Registrations Closed';

    res.json({
      success: true,
      config: {
        status: statusString,
        openDate: data.phase === 0 ? data.countdown_target : null,
        closeDate: data.close_date || (data.phase === 1 ? data.countdown_target : null),
        countdownTarget: data.countdown_target,
        minMembers: data.min_members,
        maxMembers: data.max_members,
        disableTeamLogin: data.disable_team_login,
        allowDocumentUpload: data.allow_document_upload ?? true,
        allowMemberEdits: data.allow_member_edits ?? true,
      }
    });
  } catch (err: any) {
    console.error('Error updating config:', err);
    res.status(500).json({ success: false, message: 'Failed to update configuration', error: err.message, details: err });
  }
}

export async function updateTeamHandler(req: Request, res: Response) {
  try {
    const { data: configData } = await supabase.from('admin_config').select('status, phase, close_date').eq('id', 1).maybeSingle();
    if (configData) {
      const isClosed = configData.status === 'Registrations Closed' || configData.phase === 3 || (configData.close_date && new Date(configData.close_date).getTime() < Date.now());
      if (isClosed) {
        res.status(403).json({ success: false, message: 'Registration phase is closed. Updates are locked.' });
        return;
      }
    }

    const { teamId } = req.params;
    const { teamName, members, documentUrl } = req.body;

    if (!teamName || typeof teamName !== 'string' || teamName.trim().length < 2 || teamName.trim().length > 50) {
      res.status(400).json({ success: false, message: 'Invalid team name length' });
      return;
    }
    const sanitizedTeamName = teamName.trim();

    let sanitizedMembers;
    try {
      sanitizedMembers = validateAndSanitizeMembers(members);
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
      return;
    }

    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .update({
        team_name: sanitizedTeamName,
        file_url: documentUrl
      })
      .eq('id', teamId)
      .select()
      .single();

    if (teamError) throw teamError;

    // Backup existing members for potential rollback
    const { data: existingMembers } = await supabase
      .from('members')
      .select('*')
      .eq('team_id', teamId);

    const { error: deleteError } = await supabase
      .from('members')
      .delete()
      .eq('team_id', teamId);

    if (deleteError) throw deleteError;

    const membersToInsert = sanitizedMembers.map((m: any, index: number) => ({
      team_id: teamId,
      name: m.name,
      email: m.email,
      phone: m.phone,
      college_name: m.college_name,
      semester: m.semester,
      role: index === 0 ? 'leader' : 'member'
    }));

    const { error: insertError } = await supabase
      .from('members')
      .insert(membersToInsert);

    if (insertError) {
      // Rollback members to previous state
      if (existingMembers && existingMembers.length > 0) {
        const membersToRestore = existingMembers.map((m: any) => ({
          team_id: m.team_id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          college_name: m.college_name,
          semester: m.semester,
          role: m.role
        }));
        await supabase.from('members').insert(membersToRestore);
      }
      throw insertError;
    }

    const responseTeam = {
      id: teamData.id,
      teamName: teamData.team_name,
      leaderEmail: sanitizedMembers[0].email,
      leaderPhone: sanitizedMembers[0].phone,
      documentUrl: teamData.file_url,
      demoVideoUrl: teamData.demo_video_url,
      passed_round: teamData.passed_round,
      members: sanitizedMembers
    };

    res.json({ success: true, team: responseTeam });
  } catch (err: any) {
    console.error('Error updating team:', err);
    res.status(500).json({ success: false, message: 'Failed to update team details' });
  }
}

export function uploadDocumentHandler(req: Request, res: Response) {
  if (req.fileUrl) {
    res.json({ success: true, url: req.fileUrl });
  } else {
    res.status(500).json({ error: 'Upload failed: No URL returned' });
  }
}

export async function getAllTeamsHandler(req: Request, res: Response) {
  try {
    const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*').order('created_at', { ascending: false });
    if (teamsError) throw teamsError;

    const { data: membersData, error: membersError } = await supabase.from('members').select('*');
    if (membersError) throw membersError;

    const formattedTeams = teamsData.map(t => {
      const tMembers = membersData.filter(m => m.team_id === t.id);
      return {
        id: t.id,
        teamName: t.team_name,
        leaderEmail: t.leader_email,
        leaderPhone: t.leader_phone,
        documentUrl: t.file_url,
        demoVideoUrl: t.demo_video_url,
        passed_round: t.passed_round,
        members: tMembers.map(m => ({
          name: m.name,
          email: m.email,
          phone: m.phone,
          college_name: m.college_name || '',
          semester: m.semester || null,
          role: m.role
        }))
      };
    });

    res.json({ success: true, teams: formattedTeams });
  } catch (err: any) {
    console.error('Error fetching all teams:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve teams' });
  }
}

export async function updateTeamPromotionHandler(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const { passed_round } = req.body;

    const { data, error } = await supabase
      .from('teams')
      .update({ passed_round })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, team: data });
  } catch (err: any) {
    console.error('Error updating team promotion:', err);
    res.status(500).json({ success: false, message: 'Failed to update team promotion state' });
  }
}

export async function updateDemoVideoHandler(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const { demoVideoUrl } = req.body;

    const { data, error } = await supabase
      .from('teams')
      .update({ demo_video_url: demoVideoUrl })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, team: data });
  } catch (err: any) {
    console.error('Error updating team demo video:', err);
    res.status(500).json({ success: false, message: 'Failed to update team demo video' });
  }
}
