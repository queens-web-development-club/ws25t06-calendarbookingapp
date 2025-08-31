-- Responses table (participant selections)
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    time_slot_ids UUID[] NOT NULL, -- Array of time slot IDs for scalability
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate responses for the same event by same user
    UNIQUE(event_id, user_email)
);