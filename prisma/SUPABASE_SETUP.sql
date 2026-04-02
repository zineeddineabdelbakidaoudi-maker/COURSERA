-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- DIGITHUB — Supabase Setup Guide (SQL)
-- Run these statements in order in the Supabase SQL Editor.
-- Supabase Dashboard → SQL Editor → New Query
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ─────────────────────────────────────────────────────────────
-- STEP 1: Profile Auto-Create Trigger
-- Automatically creates a Profile row when a user signs up via
-- Supabase Auth. This links auth.users ↔ public.Profile by UUID.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."Profile" (id, full_name, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::public."Role", 'buyer'::"Role")
  )
  ON CONFLICT (id) DO NOTHING;  -- Idempotent: safe to re-run
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to Supabase auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────────────────────
-- STEP 2: Row Level Security (RLS)
-- Enable RLS and define access policies for all public tables.
-- ─────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DigitalProduct" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ProductPurchase" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CartItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Payout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Wishlist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Proposal" ENABLE ROW LEVEL SECURITY;

-- Profile: Users can view all profiles, edit only their own
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public."Profile";
CREATE POLICY "Profiles are viewable by everyone" ON public."Profile"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public."Profile";
CREATE POLICY "Users can update their own profile" ON public."Profile"
  FOR UPDATE USING (auth.uid()::text = id);

-- Categories: Public read
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public."Category";
CREATE POLICY "Categories are viewable by everyone" ON public."Category"
  FOR SELECT USING (true);

-- Services: Public read for live; sellers manage their own
DROP POLICY IF EXISTS "Live services are viewable by everyone" ON public."Service";
CREATE POLICY "Live services are viewable by everyone" ON public."Service"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sellers can manage their own services" ON public."Service";
CREATE POLICY "Sellers can manage their own services" ON public."Service"
  FOR ALL USING (auth.uid()::text = seller_id);

-- Digital Products: Public read; publishers manage their own
DROP POLICY IF EXISTS "Live products are viewable by everyone" ON public."DigitalProduct";
CREATE POLICY "Live products are viewable by everyone" ON public."DigitalProduct"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Publishers can manage their own products" ON public."DigitalProduct";
CREATE POLICY "Publishers can manage their own products" ON public."DigitalProduct"
  FOR ALL USING (auth.uid()::text = publisher_id);

-- Orders: Buyer and seller can view; buyer creates
DROP POLICY IF EXISTS "Buyers and sellers can view their orders" ON public."Order";
CREATE POLICY "Buyers and sellers can view their orders" ON public."Order"
  FOR SELECT USING (auth.uid()::text = buyer_id OR auth.uid()::text = seller_id);

DROP POLICY IF EXISTS "Buyers can create orders" ON public."Order";
CREATE POLICY "Buyers can create orders" ON public."Order"
  FOR INSERT WITH CHECK (auth.uid()::text = buyer_id);

DROP POLICY IF EXISTS "Sellers can update their orders" ON public."Order";
CREATE POLICY "Sellers can update their orders" ON public."Order"
  FOR UPDATE USING (auth.uid()::text = seller_id OR auth.uid()::text = buyer_id);

-- Product Purchases: Buyer owns their purchases
DROP POLICY IF EXISTS "Buyers can manage their purchases" ON public."ProductPurchase";
CREATE POLICY "Buyers can manage their purchases" ON public."ProductPurchase"
  FOR ALL USING (auth.uid()::text = buyer_id);

-- Cart: Users own their cart
DROP POLICY IF EXISTS "Users can manage their cart" ON public."CartItem";
CREATE POLICY "Users can manage their cart" ON public."CartItem"
  FOR ALL USING (auth.uid()::text = user_id);

-- Conversations: Participants can view
DROP POLICY IF EXISTS "Participants can view conversations" ON public."Conversation";
CREATE POLICY "Participants can view conversations" ON public."Conversation"
  FOR SELECT USING (auth.uid()::text = ANY(participant_ids));

DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public."Conversation";
CREATE POLICY "Authenticated users can create conversations" ON public."Conversation"
  FOR INSERT WITH CHECK (auth.uid()::text = ANY(participant_ids));

-- Messages: Participants can view and send
DROP POLICY IF EXISTS "Participants can view messages" ON public."Message";
CREATE POLICY "Participants can view messages" ON public."Message"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public."Conversation" c
      WHERE c.id = conversation_id
      AND auth.uid()::text = ANY(c.participant_ids)
    )
  );

DROP POLICY IF EXISTS "Authenticated users can send messages" ON public."Message";
CREATE POLICY "Authenticated users can send messages" ON public."Message"
  FOR INSERT WITH CHECK (auth.uid()::text = sender_id);

-- Reviews: Public read
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public."Review";
CREATE POLICY "Reviews are viewable by everyone" ON public."Review"
  FOR SELECT USING (true);

-- Notifications: Users own their notifications
DROP POLICY IF EXISTS "Users can view their notifications" ON public."Notification";
CREATE POLICY "Users can view their notifications" ON public."Notification"
  FOR ALL USING (auth.uid()::text = user_id);

-- Payouts: Sellers own their payouts
DROP POLICY IF EXISTS "Sellers can manage their payouts" ON public."Payout";
CREATE POLICY "Sellers can manage their payouts" ON public."Payout"
  FOR ALL USING (auth.uid()::text = seller_id);

-- Wishlist: Users own their wishlist
DROP POLICY IF EXISTS "Users can manage their wishlist" ON public."Wishlist";
CREATE POLICY "Users can manage their wishlist" ON public."Wishlist"
  FOR ALL USING (auth.uid()::text = user_id);

-- Jobs: Public read; buyers manage their own
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public."Job";
CREATE POLICY "Jobs are viewable by everyone" ON public."Job"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Buyers can manage their jobs" ON public."Job";
CREATE POLICY "Buyers can manage their jobs" ON public."Job"
  FOR ALL USING (auth.uid()::text = buyer_id);

-- Proposals: Sellers manage their own; job owners can view
DROP POLICY IF EXISTS "Sellers can manage their proposals" ON public."Proposal";
CREATE POLICY "Sellers can manage their proposals" ON public."Proposal"
  FOR ALL USING (auth.uid()::text = seller_id);

DROP POLICY IF EXISTS "Job owners can view proposals" ON public."Proposal";
CREATE POLICY "Job owners can view proposals" ON public."Proposal"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public."Job" j
      WHERE j.id = job_id
      AND auth.uid()::text = j.buyer_id
    )
  );


-- ─────────────────────────────────────────────────────────────
-- STEP 3: Grants for anon and authenticated roles
-- ─────────────────────────────────────────────────────────────
GRANT SELECT ON public."Category" TO anon, authenticated;
GRANT SELECT ON public."Service" TO anon, authenticated;
GRANT SELECT ON public."DigitalProduct" TO anon, authenticated;
GRANT SELECT ON public."Review" TO anon, authenticated;
GRANT SELECT ON public."Profile" TO anon, authenticated;
GRANT SELECT ON public."Job" TO anon, authenticated;

GRANT ALL ON public."Order" TO authenticated;
GRANT ALL ON public."ProductPurchase" TO authenticated;
GRANT ALL ON public."CartItem" TO authenticated;
GRANT ALL ON public."Conversation" TO authenticated;
GRANT ALL ON public."Message" TO authenticated;
GRANT ALL ON public."Notification" TO authenticated;
GRANT ALL ON public."Payout" TO authenticated;
GRANT ALL ON public."Wishlist" TO authenticated;
GRANT ALL ON public."Proposal" TO authenticated;
GRANT UPDATE ON public."Profile" TO authenticated;
GRANT ALL ON public."Service" TO authenticated;
GRANT ALL ON public."DigitalProduct" TO authenticated;
