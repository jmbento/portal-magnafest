-- =====================================================================
-- MIGRATION: Create Events Table
-- Created: 2025-12-24
-- Updated: 2025-12-25 (Fixed for existing table)
-- Description: Basic events table with RLS for authenticated users
-- =====================================================================

-- Drop existing table if it exists (to start fresh)
DROP TABLE IF EXISTS public.events CASCADE;

-- Create events table
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    title text NOT NULL,
    description text,
    event_date timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NOT NULL DEFAULT auth.uid () REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Add table comment
COMMENT ON
TABLE public.events IS 'Stores event information created by authenticated users';

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Enable read access for all users
CREATE POLICY "Enable read access for all users" ON public.events FOR
SELECT USING (true);

-- Policy: Enable insert for authenticated users only
CREATE POLICY "Enable insert for authenticated users only" ON public.events FOR
INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
    );

-- Create index on created_by for performance
CREATE INDEX idx_events_created_by ON public.events (created_by);

-- Create index on event_date for performance
CREATE INDEX idx_events_event_date ON public.events (event_date);