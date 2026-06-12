-- DDL Script for Supabase SQL Editor
-- Creates tables: admin_config, teams, and members with cascading deletes

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. admin_config table
CREATE TABLE IF NOT EXISTS admin_config (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'Registration Not Yet Opened' 
        CHECK (status IN ('Registration Not Yet Opened', 'Registration Open', 'Registrations Closed')),
    open_date TIMESTAMP WITH TIME ZONE NULL,
    close_date TIMESTAMP WITH TIME ZONE NULL,
    min_members INTEGER NOT NULL DEFAULT 2,
    max_members INTEGER NOT NULL DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert seed config row
INSERT INTO admin_config (id, status, min_members, max_members)
VALUES (1, 'Registration Open', 2, 4)
ON CONFLICT (id) DO NOTHING;

-- 2. teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL UNIQUE,
    leader_phone VARCHAR(50) NOT NULL,
    document_url TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. members table (references teams with CASCADE delete rules)
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers to update 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_config_updated_at
    BEFORE UPDATE ON admin_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add new columns for Phase 2 Updates
ALTER TABLE teams ADD COLUMN IF NOT EXISTS passed_round INT NOT NULL DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS demo_video_url TEXT NULL;
ALTER TABLE admin_config ADD COLUMN IF NOT EXISTS disable_team_login BOOLEAN NOT NULL DEFAULT FALSE;

