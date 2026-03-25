-- Create profiles for all existing users who don't have one
-- This handles cases where users signed up before the trigger was created
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT * FROM auth.users LOOP
        BEGIN
            INSERT INTO public."Profile" (id, full_name, email, role, country)
            VALUES (
                user_record.id,
                user_record.raw_user_meta_data->>'full_name',
                user_record.email,
                COALESCE((user_record.raw_user_meta_data->>'role')::public."Role", 'buyer'::public."Role"),
                'DZ'
            )
            ON CONFLICT (id) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
            -- Skip rows that cause errors (e.g. duplicate emails)
            RAISE NOTICE 'Skipping user %: %', user_record.id, SQLERRM;
        END;
    END LOOP;
END $$;
