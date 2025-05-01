CREATE TABLE IF NOT EXISTS contact_form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (submit forms)
CREATE POLICY "Allow public insert" ON contact_form_submissions
  FOR INSERT TO public
  WITH CHECK (true);

-- Only allow authenticated users to view submissions
CREATE POLICY "Allow authenticated select" ON contact_form_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS contact_form_submissions_email_idx ON contact_form_submissions (email);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_contact_form_submissions_updated_at
BEFORE UPDATE ON contact_form_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 