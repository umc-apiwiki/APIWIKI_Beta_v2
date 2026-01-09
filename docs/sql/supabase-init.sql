-- Supabase SQL: initial schema for API WIKI
-- Run this in Supabase SQL editor (public schema)

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Users table
create table if not exists "User" (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    name text,
    createdAt timestamp with time zone not null default now(),
    updatedAt timestamp with time zone not null default now()
);

-- APIs table
create table if not exists "Api" (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    baseUrl text,
    category text,
    createdAt timestamp with time zone not null default now(),
    updatedAt timestamp with time zone not null default now(),
    createdBy uuid,
    constraint "Api_createdBy_fkey" foreign key (createdBy) references "User"(id) on delete set null on update cascade
);

-- Trigger to keep updatedAt fresh
-- Trigger to keep updatedAt fresh (Camel Case for User/Api)
create or replace function set_updated_at_camel_case()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

create trigger user_set_updated_at
before update on "User"
for each row execute procedure set_updated_at_camel_case();

create trigger api_set_updated_at
before update on "Api"
for each row execute procedure set_updated_at_camel_case();
