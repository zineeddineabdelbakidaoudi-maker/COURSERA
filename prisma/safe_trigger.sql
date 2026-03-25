-- SAFE TRIGGER that will NEVER block signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  BEGIN
    INSERT INTO public."Profile" (id, full_name, email, role)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'full_name', ''),
      new.email,
      COALESCE((new.raw_user_meta_data->>'role')::public."Role", 'buyer'::public."Role")
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but allow signup to proceed
    RAISE NOTICE 'Caught error in trigger: %', SQLERRM;
  END;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
