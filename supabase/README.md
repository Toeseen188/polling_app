# Supabase Database Schema Setup

This directory contains the database schema for the Polling App with QR Code Sharing.

## Files

- `schema.sql` - Complete database schema with tables, views, policies, and functions
- `README.md` - This setup guide

## Database Schema Overview

The schema includes the following main components:

### Tables

1. **`users`** - User profiles (extends Supabase auth.users)
2. **`polls`** - Poll information and metadata
3. **`poll_options`** - Individual options for each poll
4. **`votes`** - User votes on poll options

### Views

1. **`poll_results`** - Aggregated vote counts for each poll option
2. **`active_polls`** - Active polls with creator info and statistics

### Key Features

- **Row Level Security (RLS)** enabled on all tables
- **Automatic timestamps** for created_at and updated_at
- **Poll expiration handling** with automatic status updates
- **Performance indexes** on frequently queried columns
- **Comprehensive RLS policies** for secure access control

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

### 2. Set Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run the Schema

#### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Click "Run" to execute the schema

#### Option B: Using Supabase CLI

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link your project: `supabase link --project-ref your_project_ref`
4. Run the schema: `supabase db reset --linked`

### 4. Verify Setup

After running the schema, you should see:

- 4 tables created (users, polls, poll_options, votes)
- 2 views created (poll_results, active_polls)
- RLS policies applied to all tables
- Indexes created for performance

## Database Relationships

```
users (1) ←→ (many) polls
polls (1) ←→ (many) poll_options
polls (1) ←→ (many) votes
poll_options (1) ←→ (many) votes
users (1) ←→ (many) votes
```

## RLS Policies

The schema includes comprehensive Row Level Security policies:

- **Users**: Can only view/edit their own profile
- **Polls**: Anyone can view active polls, creators have full access
- **Poll Options**: Anyone can view options for active polls, creators have full access
- **Votes**: Users can only view their own votes, poll creators can see all votes for their polls

## Usage Examples

### Creating a Poll

```sql
-- Insert poll
INSERT INTO polls (title, description, created_by, allow_multiple_votes, expires_at)
VALUES ('Favorite Color', 'What is your favorite color?', 'user-uuid', false, '2024-12-31 23:59:59+00');

-- Insert poll options
INSERT INTO poll_options (poll_id, text) VALUES 
('poll-uuid', 'Red'),
('poll-uuid', 'Blue'),
('poll-uuid', 'Green');
```

### Getting Poll Results

```sql
-- Use the poll_results view
SELECT * FROM poll_results WHERE poll_id = 'poll-uuid';

-- Or query directly
SELECT 
    po.text,
    COUNT(v.id) as vote_count
FROM poll_options po
LEFT JOIN votes v ON po.id = v.option_id
WHERE po.poll_id = 'poll-uuid'
GROUP BY po.id, po.text
ORDER BY vote_count DESC;
```

### Getting Active Polls

```sql
-- Use the active_polls view
SELECT * FROM active_polls;
```

## Maintenance

### Updating JWT Secret

If you need to update the JWT secret:

```sql
ALTER DATABASE postgres SET "app.jwt_secret" TO 'new-jwt-secret';
```

### Adding New Poll Types

To add new poll features, you can extend the schema:

```sql
-- Example: Add poll categories
ALTER TABLE polls ADD COLUMN category TEXT;
CREATE INDEX idx_polls_category ON polls(category);
```

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Ensure you're authenticated and have the correct permissions
2. **Foreign Key Violations**: Check that referenced IDs exist in parent tables
3. **Permission Denied**: Verify RLS policies are correctly configured

### Reset Database

If you need to start fresh:

```sql
-- Drop all tables (be careful!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres, anon, authenticated;

-- Then re-run the schema.sql file
```

## Security Notes

- All tables have RLS enabled by default
- Users can only access data they're authorized to see
- Poll creators have full control over their polls
- Anonymous users can view active polls but cannot vote
- Authenticated users can only vote once per option per poll (unless multiple votes are allowed)

## Performance Considerations

- Indexes are created on frequently queried columns
- Views are optimized for common query patterns
- Consider adding additional indexes based on your specific query patterns
- Monitor query performance using Supabase's built-in analytics
