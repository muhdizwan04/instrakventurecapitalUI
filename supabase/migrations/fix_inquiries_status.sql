-- Fix Inquiries Status Constraint
-- The error 400 usually indicates a check constraint violation.
-- This script updates the allowed values for the 'status' column.

-- 1. Drop the existing constraint (name might vary, trying common ones)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inquiries_status_check') THEN
        ALTER TABLE public.inquiries DROP CONSTRAINT inquiries_status_check;
    END IF;
END $$;

-- 2. Add the correct constraint matching the frontend
ALTER TABLE public.inquiries 
ADD CONSTRAINT inquiries_status_check 
CHECK (status IN ('new', 'in_progress', 'contacted', 'qualified', 'resolved', 'lost'));
