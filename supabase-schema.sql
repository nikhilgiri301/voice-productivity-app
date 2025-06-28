-- Personal Organizer Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE item_type AS ENUM ('calendar', 'task', 'note');
CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE created_via AS ENUM ('voice', 'manual');

-- Create productivity_items table
CREATE TABLE productivity_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type item_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Calendar-specific fields
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    attendees TEXT[], -- Array of email addresses or names
    
    -- Task-specific fields
    due_date TIMESTAMP WITH TIME ZONE,
    priority priority_level DEFAULT 'medium',
    completed BOOLEAN DEFAULT FALSE,
    
    -- Note-specific fields
    content TEXT,
    tags TEXT[], -- Array of tag strings
    
    -- Linking & Context
    linked_items UUID[], -- Array of related item IDs
    created_via created_via DEFAULT 'manual',
    ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
    
    -- Constraints
    CONSTRAINT calendar_fields_check CHECK (
        type != 'calendar' OR (start_time IS NOT NULL AND end_time IS NOT NULL)
    ),
    CONSTRAINT task_completed_check CHECK (
        type != 'task' OR completed IS NOT NULL
    ),
    CONSTRAINT note_content_check CHECK (
        type != 'note' OR content IS NOT NULL
    )
);

-- Create user_preferences table
CREATE TABLE user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    default_calendar_duration INTEGER DEFAULT 60, -- minutes
    default_task_priority priority_level DEFAULT 'medium',
    voice_enabled BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create item_links table for many-to-many relationships
CREATE TABLE item_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_item_id UUID REFERENCES productivity_items(id) ON DELETE CASCADE,
    to_item_id UUID REFERENCES productivity_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_item_id, to_item_id)
);

-- Create indexes for better performance
CREATE INDEX idx_productivity_items_user_id ON productivity_items(user_id);
CREATE INDEX idx_productivity_items_type ON productivity_items(type);
CREATE INDEX idx_productivity_items_created_at ON productivity_items(created_at);
CREATE INDEX idx_productivity_items_start_time ON productivity_items(start_time) WHERE start_time IS NOT NULL;
CREATE INDEX idx_productivity_items_due_date ON productivity_items(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_productivity_items_completed ON productivity_items(completed) WHERE type = 'task';

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_productivity_items_updated_at 
    BEFORE UPDATE ON productivity_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE productivity_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own productivity items
CREATE POLICY "Users can view their own productivity items" ON productivity_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own productivity items" ON productivity_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own productivity items" ON productivity_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own productivity items" ON productivity_items
    FOR DELETE USING (auth.uid() = user_id);

-- Users can only access their own preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only access links for their own items
CREATE POLICY "Users can view links for their own items" ON item_links
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM productivity_items 
            WHERE id = from_item_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert links for their own items" ON item_links
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM productivity_items 
            WHERE id = from_item_id AND user_id = auth.uid()
        ) AND
        EXISTS (
            SELECT 1 FROM productivity_items 
            WHERE id = to_item_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete links for their own items" ON item_links
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM productivity_items 
            WHERE id = from_item_id AND user_id = auth.uid()
        )
    );

-- Create helpful views
CREATE VIEW today_items AS
SELECT * FROM productivity_items
WHERE 
    (type = 'calendar' AND DATE(start_time) = CURRENT_DATE) OR
    (type = 'task' AND DATE(due_date) = CURRENT_DATE) OR
    (type = 'note' AND DATE(created_at) = CURRENT_DATE);

-- Create function to get linked items
CREATE OR REPLACE FUNCTION get_linked_items(item_uuid UUID)
RETURNS TABLE (
    id UUID,
    type item_type,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT pi.id, pi.type, pi.title, pi.description, pi.created_at
    FROM productivity_items pi
    JOIN item_links il ON pi.id = il.to_item_id
    WHERE il.from_item_id = item_uuid
    UNION
    SELECT pi.id, pi.type, pi.title, pi.description, pi.created_at
    FROM productivity_items pi
    JOIN item_links il ON pi.id = il.from_item_id
    WHERE il.to_item_id = item_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
