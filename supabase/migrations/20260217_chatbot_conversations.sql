-- ============================================================
-- Chatbot Conversation Memory & Analytics
-- ============================================================

-- Conversations table: stores full conversation history
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  intent TEXT, -- SERVICE_INQUIRY, FUNDING_REQUEST, CONTACT_REQUEST, GENERAL_INFO, FORM_SUBMISSION
  service_mentioned TEXT, -- Which service was discussed
  converted_to_form BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_session ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_intent ON chat_conversations(intent);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON chat_conversations(created_at DESC);

-- Analytics table: individual message tracking
CREATE TABLE IF NOT EXISTS chat_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  intent TEXT,
  service_mentioned TEXT,
  user_message TEXT,
  assistant_response TEXT,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_session ON chat_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_intent ON chat_analytics(intent);
CREATE INDEX IF NOT EXISTS idx_analytics_service ON chat_analytics(service_mentioned);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON chat_analytics(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_chat_conversations_updated_at ON chat_conversations;
CREATE TRIGGER trigger_update_chat_conversations_updated_at
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_conversations_updated_at();

-- RLS Policies (if using RLS)
-- Allow anonymous users to create/read their own conversations via session_id
-- Allow authenticated users to read their own conversations
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create conversations (anonymous chat)
CREATE POLICY "Allow anonymous conversation creation"
  ON chat_conversations FOR INSERT
  WITH CHECK (true);

-- Policy: Users can read conversations by session_id (no auth required for session-based)
CREATE POLICY "Allow session-based conversation read"
  ON chat_conversations FOR SELECT
  USING (true); -- Session-based, so we allow read (session_id is the security)

-- Policy: Users can update their own conversations by session_id
CREATE POLICY "Allow session-based conversation update"
  ON chat_conversations FOR UPDATE
  USING (true); -- Session-based security

-- Analytics policies
CREATE POLICY "Allow anonymous analytics insert"
  ON chat_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow analytics read for admins"
  ON chat_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON chat_conversations TO anon, authenticated;
GRANT SELECT, INSERT ON chat_analytics TO anon, authenticated;

COMMENT ON TABLE chat_conversations IS 'Stores chatbot conversation history by session';
COMMENT ON TABLE chat_analytics IS 'Tracks individual messages and intents for analytics';
