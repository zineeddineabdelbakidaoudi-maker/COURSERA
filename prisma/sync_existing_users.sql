-- Sync existing users from auth.users to public.Profile
INSERT INTO public."Profile" (id, full_name, email, role)
SELECT 
  id, 
  raw_user_meta_data->>'full_name', 
  email, 
  COALESCE((raw_user_meta_data->>'role')::public."Role", 'buyer'::public."Role")
FROM auth.users
ON CONFLICT (id) DO NOTHING;
