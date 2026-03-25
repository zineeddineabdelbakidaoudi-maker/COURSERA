-- Final sync for all existing users with correct fields
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT * FROM auth.users LOOP
        BEGIN
            INSERT INTO public."Profile" (
                id, 
                full_name, 
                email, 
                role, 
                languages, 
                country,
                updated_at,
                created_at,
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
                user_record.id,
                COALESCE(user_record.raw_user_meta_data->>'full_name', ''),
                user_record.email,
                COALESCE((user_record.raw_user_meta_data->>'role')::public."Role", 'buyer'::public."Role"),
                '{}',
                'DZ',
                now(),
                now(),
                'none',
                'disabled',
                'new',
                0,
                0,
                0,
                false,
                0
            )
            ON CONFLICT (id) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping user %: %', user_record.id, SQLERRM;
        END;
    END LOOP;
END $$;
