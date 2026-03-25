-- Improved function to handle new user signups with robust defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."Profile" (
    id, 
    full_name, 
    email, 
    role, 
    languages, 
    publisher_allowed_categories,
    country,
    seller_status,
    publisher_status,
    seller_level,
    rating_avg,
    total_reviews,
    total_orders_completed,
    is_verified,
    credit_balance_dzd
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::public."Role", 'buyer'::public."Role"),
    '{}',
    '{}',
    'DZ',
    'none',
    'disabled',
    'new',
    0,
    0,
    0,
    false,
    0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-sync trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
