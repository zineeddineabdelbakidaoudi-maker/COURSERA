-- Enable RLS for Interaction tables
ALTER TABLE public."CartItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Wishlist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;

-- 1. CartItem Policies (Users manage their own cart)
DROP POLICY IF EXISTS "Users can manage their own cart" ON public."CartItem";
CREATE POLICY "Users can manage their own cart" ON public."CartItem"
  FOR ALL USING (auth.uid()::text = user_id);

-- 2. Wishlist Policies (Users manage their own saved items)
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public."Wishlist";
CREATE POLICY "Users can manage their own wishlist" ON public."Wishlist"
  FOR ALL USING (auth.uid()::text = user_id);

-- 3. Conversation Policies (Users see conversations they are part of)
-- participant_ids is a text[] (array)
DROP POLICY IF EXISTS "Users can see their own conversations" ON public."Conversation";
CREATE POLICY "Users can see their own conversations" ON public."Conversation"
  FOR SELECT USING (auth.uid()::text = ANY(participant_ids));

DROP POLICY IF EXISTS "Users can create conversations" ON public."Conversation";
CREATE POLICY "Users can create conversations" ON public."Conversation"
  FOR INSERT WITH CHECK (auth.uid()::text = ANY(participant_ids));

-- 4. Message Policies (Participants can see and send messages)
DROP POLICY IF EXISTS "Participants can see messages" ON public."Message";
CREATE POLICY "Participants can see messages" ON public."Message"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public."Conversation" 
      WHERE id = conversation_id AND auth.uid()::text = ANY(participant_ids)
    )
  );

DROP POLICY IF EXISTS "Participants can send messages" ON public."Message";
CREATE POLICY "Participants can send messages" ON public."Message"
  FOR INSERT WITH CHECK (auth.uid()::text = sender_id);

-- 5. Order Policies (Buyer and Seller can see their orders)
DROP POLICY IF EXISTS "Buyers and sellers can see their orders" ON public."Order";
CREATE POLICY "Buyers and sellers can see their orders" ON public."Order"
  FOR SELECT USING (auth.uid()::text = buyer_id OR auth.uid()::text = seller_id);

-- 6. Review Policies (Allow inserting own reviews)
DROP POLICY IF EXISTS "Buyers can add reviews for their orders" ON public."Review";
CREATE POLICY "Buyers can add reviews for their orders" ON public."Review"
  FOR INSERT WITH CHECK (auth.uid()::text = reviewer_id);

-- 7. Permissions
GRANT ALL ON public."CartItem" TO authenticated;
GRANT ALL ON public."Wishlist" TO authenticated;
GRANT ALL ON public."Conversation" TO authenticated;
GRANT ALL ON public."Message" TO authenticated;
GRANT SELECT ON public."Order" TO authenticated;
GRANT ALL ON public."Review" TO authenticated;
