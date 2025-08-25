-- Enable Row Level Security
ALTER DATABASE CURRENT SET row_security = on;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- TABLES
-- =====================================================

-- Events table (meetings and interviews)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('meeting', 'interview')),
    settings JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time slots table (availability windows for meetings, bookable slots for interviews)
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure end_time is after start_time
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Responses table (participant selections)
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate responses for the same slot by same user
    UNIQUE(time_slot_id, user_email)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Events indexes
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_organizer_email ON events(organizer_email);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_access_token ON events(access_token);

-- Time slots indexes
CREATE INDEX idx_time_slots_event_id ON time_slots(event_id);
CREATE INDEX idx_time_slots_start_time ON time_slots(start_time);
CREATE INDEX idx_time_slots_is_available ON time_slots(is_available) WHERE is_available = true;
CREATE INDEX idx_time_slots_event_available ON time_slots(event_id, is_available) WHERE is_available = true;

-- Responses indexes
CREATE INDEX idx_responses_event_id ON responses(event_id);
CREATE INDEX idx_responses_time_slot_id ON responses(time_slot_id);
CREATE INDEX idx_responses_user_email ON responses(user_email);
CREATE INDEX idx_responses_created_at ON responses(created_at DESC);

-- Composite index for fast lookups
CREATE INDEX idx_responses_event_user ON responses(event_id, user_email);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp on events
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Prevent booking unavailable interview slots
CREATE OR REPLACE FUNCTION check_slot_availability()
RETURNS TRIGGER AS $$
DECLARE
    event_type VARCHAR(20);
    slot_available BOOLEAN;
BEGIN
    -- Get event type and slot availability
    SELECT e.type, ts.is_available 
    INTO event_type, slot_available
    FROM events e 
    JOIN time_slots ts ON ts.event_id = e.id 
    WHERE ts.id = NEW.time_slot_id;
    
    -- For interviews, check if slot is available
    IF event_type = 'interview' AND NOT slot_available THEN
        RAISE EXCEPTION 'This interview slot is no longer available';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_slot_availability_trigger
    BEFORE INSERT ON responses
    FOR EACH ROW
    EXECUTE FUNCTION check_slot_availability();

-- Mark interview slots as unavailable when booked
CREATE OR REPLACE FUNCTION mark_interview_slot_unavailable()
RETURNS TRIGGER AS $$
DECLARE
    event_type VARCHAR(20);
BEGIN
    -- Get event type
    SELECT e.type INTO event_type
    FROM events e 
    JOIN time_slots ts ON ts.event_id = e.id 
    WHERE ts.id = NEW.time_slot_id;
    
    -- Mark interview slot as unavailable
    IF event_type = 'interview' THEN
        UPDATE time_slots 
        SET is_available = false 
        WHERE id = NEW.time_slot_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mark_interview_slot_unavailable_trigger
    AFTER INSERT ON responses
    FOR EACH ROW
    EXECUTE FUNCTION mark_interview_slot_unavailable();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active events" ON events
    FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can create events" ON events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view time slots for active events" ON time_slots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = time_slots.event_id 
            AND events.status = 'active'
        )
    );

-- Responses policies
-- Users can view responses for events they're involved in
CREATE POLICY "Users can view relevant responses" ON responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = responses.event_id 
        )
    );

-- Users can create their own responses
CREATE POLICY "Users can create responses" ON responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_id 
            AND events.status = 'active'
        )
    );

-- Users can delete their own responses
CREATE POLICY "Users can delete their responses" ON responses
    FOR DELETE WITH CHECK (TRUE);


-- View for available interview slots
CREATE VIEW available_interview_slots AS
SELECT 
    ts.id,
    ts.event_id,
    ts.start_time,
    ts.end_time,
    e.title AS event_title,
    e.organizer_name,
    e.settings
FROM time_slots ts
JOIN events e ON e.id = ts.event_id
WHERE e.type = 'interview' 
    AND e.status = 'active'
    AND ts.is_available = true
ORDER BY ts.start_time;

-- View for meeting availability summary
CREATE VIEW meeting_availability_summary AS
SELECT 
    e.id AS event_id,
    e.title,
    e.organizer_name,
    ts.id AS slot_id,
    ts.start_time,
    ts.end_time,
    COUNT(r.id) as response_count,
    ARRAY_AGG(r.user_name ORDER BY r.created_at) as respondents
FROM events e
JOIN time_slots ts ON ts.event_id = e.id
LEFT JOIN responses r ON r.time_slot_id = ts.id
WHERE e.type = 'meeting' AND e.status = 'active'
GROUP BY e.id, e.title, e.organizer_name, ts.id, ts.start_time, ts.end_time
ORDER BY ts.start_time;

-- View for event statistics
CREATE VIEW event_stats AS
SELECT 
    e.id,
    e.title,
    e.type,
    e.organizer_name,
    e.created_at,
    COUNT(DISTINCT ts.id) as total_slots,
    COUNT(DISTINCT r.id) as total_responses,
    COUNT(DISTINCT r.user_email) as unique_respondents,
    CASE 
        WHEN e.type = 'interview' THEN 
            COUNT(DISTINCT ts.id) FILTER (WHERE NOT ts.is_available)
        ELSE COUNT(DISTINCT r.id)
    END as booked_slots
FROM events e
LEFT JOIN time_slots ts ON ts.event_id = e.id
LEFT JOIN responses r ON r.event_id = e.id
GROUP BY e.id, e.title, e.type, e.organizer_name, e.created_at;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get optimal meeting times (most responses)
CREATE OR REPLACE FUNCTION get_optimal_meeting_times(event_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    slot_id UUID,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    response_count BIGINT,
    respondent_emails TEXT[]
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        ts.id,
        ts.start_time,
        ts.end_time,
        COUNT(r.id) as response_count,
        ARRAY_AGG(r.user_email ORDER BY r.created_at) as respondent_emails
    FROM time_slots ts
    LEFT JOIN responses r ON r.time_slot_id = ts.id
    JOIN events e ON e.id = ts.event_id
    WHERE ts.event_id = event_uuid 
        AND e.type = 'meeting'
        AND e.status = 'active'
    GROUP BY ts.id, ts.start_time, ts.end_time
    ORDER BY COUNT(r.id) DESC, ts.start_time
    LIMIT limit_count;
END;
$ LANGUAGE plpgsql;

-- =====================================================
-- ADDITIONAL HELPER FUNCTIONS FOR LINK-BASED ACCESS
-- =====================================================

-- Function to get event by access token (for shareable links)
CREATE OR REPLACE FUNCTION get_event_by_token(token UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR(100),
    description TEXT,
    organizer_name VARCHAR(100),
    type VARCHAR(20),
    settings JSONB,
    status VARCHAR(20)
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.description,
        e.organizer_name,
        e.type,
        e.settings,
        e.status
    FROM events e
    WHERE e.access_token = token 
        AND e.status = 'active';
END;
$ LANGUAGE plpgsql;
