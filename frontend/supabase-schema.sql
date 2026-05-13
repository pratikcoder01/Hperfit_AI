-- HyperFitness AI - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Profiles Table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'member' check (role in ('admin', 'member')),
  xp integer default 0,
  level integer default 1,
  rank text default 'Bronze',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Social Posts Table
create table if not exists social_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  media_url text,
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists profiles_email_idx on profiles(email);
create index if not exists profiles_role_idx on profiles(role);
create index if not exists social_posts_user_id_idx on social_posts(user_id);
create index if not exists social_posts_created_at_idx on social_posts(created_at desc);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, xp, level, rank)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'member',
    0,
    1,
    'Bronze'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at on profiles
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure public.update_updated_at_column();

-- Row Level Security (RLS) Policies
alter table profiles enable row level security;
alter table social_posts enable row level security;

-- Profiles RLS Policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Social Posts RLS Policies
create policy "Anyone can view social posts"
  on social_posts for select
  using (true);

create policy "Authenticated users can create posts"
  on social_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on social_posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on social_posts for delete
  using (auth.uid() = user_id);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on profiles to anon, authenticated;
grant all on social_posts to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- Enable Realtime (after tables are created)
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table social_posts;
