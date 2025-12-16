-- Supabase SQL: Auth extension for API WIKI
-- Run this in Supabase SQL editor after supabase-init.sql

-- Add authentication and user grade columns to User table
alter table "User" 
add column if not exists password_hash text,
add column if not exists grade text not null default 'bronze' check (grade in ('bronze', 'silver', 'gold', 'admin')),
add column if not exists activity_score integer not null default 0;

-- Create index for faster grade queries
create index if not exists idx_user_grade on "User"(grade);

-- Create index for faster activity score queries
create index if not exists idx_user_activity_score on "User"(activity_score);
