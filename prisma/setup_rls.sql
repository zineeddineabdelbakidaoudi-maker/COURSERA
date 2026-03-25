-- Grant necessary permissions to the Profile table
GRANT SELECT, INSERT, UPDATE ON public."Profile" TO anon, authenticated;

-- Enable Row Level Security
ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public."Profile";
CREATE POLICY "Public profiles are viewable by everyone"
  ON public."Profile" FOR SELECT
  USING (true);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public."Profile";
CREATE POLICY "Users can insert their own profile"
  ON public."Profile" FOR INSERT
  WITH CHECK (auth.uid()::text = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public."Profile";
CREATE POLICY "Users can update own profile"
  ON public."Profile" FOR UPDATE
  USING (auth.uid()::text = id);
