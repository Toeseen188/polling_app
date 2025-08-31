-- Supabase Database Schema for Polling App
-- This file contains the SQL schema for creating the required tables

-- Enable Row Level Security (RLS)
-- Note: Supabase automatically manages JWT secrets, no need to set manually

-- Create custom types
CREATE TYPE poll_status AS ENUM ('active', 'inactive', 'expired');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Polls table
CREATE TABLE public.polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    allow_multiple_votes BOOLEAN DEFAULT false NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Poll options table
CREATE TABLE public.poll_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Votes table
CREATE TABLE public.votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    -- Ensure a user can only vote once per option per poll (unless multiple votes allowed)
    UNIQUE(poll_id, user_id, option_id)
);

-- Create indexes for better performance
CREATE INDEX idx_polls_created_by ON public.polls(created_by);
CREATE INDEX idx_polls_is_active ON public.polls(is_active);
CREATE INDEX idx_polls_expires_at ON public.polls(expires_at);
CREATE INDEX idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);
CREATE INDEX idx_votes_option_id ON public.votes(option_id);

-- Create a view for poll results with vote counts
CREATE VIEW public.poll_results AS
SELECT 
    po.id as option_id,
    po.poll_id,
    po.text as option_text,
    COUNT(v.id) as vote_count
FROM public.poll_options po
LEFT JOIN public.votes v ON po.id = v.option_id
GROUP BY po.id, po.poll_id, po.text
ORDER BY po.poll_id, vote_count DESC;

-- Create a view for active polls
CREATE VIEW public.active_polls AS
SELECT 
    p.*,
    u.name as creator_name,
    COUNT(DISTINCT po.id) as option_count,
    COUNT(DISTINCT v.id) as total_votes
FROM public.polls p
JOIN public.users u ON p.created_by = u.id
LEFT JOIN public.poll_options po ON p.id = po.poll_id
LEFT JOIN public.votes v ON p.id = v.poll_id
WHERE p.is_active = true 
    AND (p.expires_at IS NULL OR p.expires_at > NOW())
GROUP BY p.id, u.name;

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for polls table
CREATE POLICY "Anyone can view active polls" ON public.polls
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view polls they created" ON public.polls
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Authenticated users can create polls" ON public.polls
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update polls they created" ON public.polls
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete polls they created" ON public.polls
    FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for poll_options table
CREATE POLICY "Anyone can view poll options for active polls" ON public.poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND is_active = true
        )
    );

CREATE POLICY "Users can view poll options for polls they created" ON public.poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can create options for polls they created" ON public.poll_options
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update options for polls they created" ON public.poll_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete options for polls they created" ON public.poll_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND created_by = auth.uid()
        )
    );

-- RLS Policies for votes table
CREATE POLICY "Users can view votes for polls they created" ON public.votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can view their own votes" ON public.votes
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can vote on active polls" ON public.votes
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL 
        AND user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND is_active = true
            AND (expires_at IS NULL OR expires_at > NOW())
        )
    );

CREATE POLICY "Users can delete their own votes" ON public.votes
    FOR DELETE USING (user_id = auth.uid());

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON public.polls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if a poll has expired and update status
CREATE OR REPLACE FUNCTION check_poll_expiration()
RETURNS TRIGGER AS $$
BEGIN
    -- Update polls that have expired
    UPDATE public.polls 
    SET is_active = false 
    WHERE expires_at IS NOT NULL 
        AND expires_at <= NOW() 
        AND is_active = true;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to check expiration on insert/update
CREATE TRIGGER check_poll_expiration_trigger
    AFTER INSERT OR UPDATE ON public.polls
    FOR EACH ROW EXECUTE FUNCTION check_poll_expiration();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant permissions on views
GRANT SELECT ON public.poll_results TO anon, authenticated;
GRANT SELECT ON public.active_polls TO anon, authenticated;
