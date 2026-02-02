-- Create filestreams_credentials table for storing encrypted API keys
CREATE TABLE IF NOT EXISTS filestreams_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key1_encrypted TEXT NOT NULL,
  api_key2_encrypted TEXT NOT NULL,
  access_token_encrypted TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE filestreams_credentials ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own credentials
CREATE POLICY "Users can manage own credentials"
  ON filestreams_credentials
  FOR ALL
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_filestreams_credentials_user_id 
  ON filestreams_credentials(user_id);

-- Add comment
COMMENT ON TABLE filestreams_credentials IS 'Stores encrypted Filestreams API credentials for users';
