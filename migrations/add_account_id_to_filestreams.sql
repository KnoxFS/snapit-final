-- Add account_id column to filestreams_credentials table
ALTER TABLE filestreams_credentials 
ADD COLUMN IF NOT EXISTS account_id TEXT;

-- Add comment
COMMENT ON COLUMN filestreams_credentials.account_id IS 'Filestreams account ID returned from authorization';
