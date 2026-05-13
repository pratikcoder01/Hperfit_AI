# Supabase Integration Setup Guide

## Overview
HyperFitness AI now uses Supabase for authentication and real-time data synchronization instead of FastAPI.

## Prerequisites
- A Supabase account (free tier works)
- Supabase project created

## Step 1: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Navigate to **Settings > API**
4. Copy:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## Step 2: Add Environment Variables

Add these to your `frontend/.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** to execute the schema

This will create:
- `profiles` table (extends auth.users with gamification data)
- `social_posts` table (for social feed)
- Automatic profile creation on user signup
- Row Level Security (RLS) policies
- Real-time subscriptions enabled

## Step 4: Configure Authentication Settings

1. Go to **Authentication > Providers**
2. Ensure **Email** provider is enabled
3. Under **Authentication > URL Configuration**, set:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`

## Step 5: Enable Realtime

1. Go to **Database > Replication**
2. Enable **Realtime** for:
   - `profiles` table
   - `social_posts` table

## Step 6: Test the Integration

### Test Registration
1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000/auth/register`
3. Fill out the form and submit
4. Check Supabase dashboard > Authentication > Users to verify user creation
5. Check Supabase dashboard > Database > profiles to verify profile creation

### Test Login
1. Navigate to `http://localhost:3000/auth/login`
2. Use the credentials you just created
3. Verify successful login and redirect to dashboard

### Test Real-time Updates
1. Open two browser windows
2. Log in as the same user in both
3. Update profile data in one window
4. Verify the other window updates automatically (using `useUserProfileRealtime` hook)

## Files Modified/Created

### Modified Files
- `frontend/store/authStore.ts` - Updated to use Supabase auth
- `frontend/types/index.ts` - Added gamification fields to AuthUser

### Created Files
- `frontend/lib/supabase.ts` - Supabase client configuration
- `frontend/hooks/useSupabaseRealtime.ts` - Real-time subscription hooks
- `frontend/supabase-schema.sql` - Database schema
- `frontend/SUPABASE_SETUP.md` - This guide

## Real-time Hooks Usage

### useUserProfileRealtime
```typescript
import { useUserProfileRealtime } from '@/hooks/useSupabaseRealtime';

function ProfilePage() {
  const { profile, error } = useUserProfileRealtime(userId);
  
  if (error) return <div>Error loading profile</div>;
  if (!profile) return <div>Loading...</div>;
  
  return <div>{profile.full_name}</div>;
}
```

### useSocialFeedRealtime
```typescript
import { useSocialFeedRealtime } from '@/hooks/useSupabaseRealtime';

function SocialFeed() {
  const { posts, error } = useSocialFeedRealtime();
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
}
```

### useSupabaseRealtime (Generic)
```typescript
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

function CustomTable() {
  const { data, error } = useSupabaseRealtime<any>(
    'your_table',
    { column: 'user_id', value: userId }
  );
  
  // data updates in real-time
}
```

## Migration Notes

### From FastAPI to Supabase
- **Auth**: JWT tokens now managed by Supabase
- **Database**: PostgreSQL now hosted on Supabase
- **Real-time**: Built-in Supabase Realtime replaces custom WebSocket implementation
- **User profiles**: Automatically created on signup via database trigger

### Backend Changes
The FastAPI backend can now focus on:
- AI/ML processing (Gemini, MediaPipe)
- Background tasks (Celery)
- Business logic that doesn't fit in Supabase

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server after adding variables

### "Profile not found after registration"
- Check that the database trigger `handle_new_user` was created
- Verify the trigger is firing in Supabase logs

### Real-time not working
- Ensure Realtime is enabled in Database > Replication
- Check that tables are added to the `supabase_realtime` publication

### RLS policy errors
- Verify RLS policies are correctly set up
- Check that the user is authenticated when making requests

## Next Steps

1. **Wearable Integration**: Use Supabase Edge Functions to sync Apple Health/Garmin data
2. **AI Voice**: Store voice recordings in Supabase Storage
3. **Mobile App**: Use Supabase Auth with React Native
4. **Multi-tenant**: Use Supabase's organization features for SaaS
