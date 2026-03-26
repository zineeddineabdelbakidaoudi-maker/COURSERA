-- Enable RLS for Marketplace tables
ALTER TABLE public."Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DigitalProduct" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;

-- 1. Category Policies (Everyone can view)
-- Important: Use "" for table names that were set up via Prisma/Postgres with double quotes
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public."Category";
CREATE POLICY "Categories are viewable by everyone" ON public."Category" 
  FOR SELECT USING (true);

-- 2. Service Policies (Everyone can view live services)
DROP POLICY IF EXISTS "Live services are viewable by everyone" ON public."Service";
CREATE POLICY "Live services are viewable by everyone" ON public."Service" 
  FOR SELECT USING (true);

-- Sellers can manage their own services
DROP POLICY IF EXISTS "Sellers can manage their own services" ON public."Service";
CREATE POLICY "Sellers can manage their own services" ON public."Service" 
  FOR ALL USING (auth.uid()::text = seller_id);

-- 3. DigitalProduct Policies (Everyone can view live products)
DROP POLICY IF EXISTS "Live products are viewable by everyone" ON public."DigitalProduct";
CREATE POLICY "Live products are viewable by everyone" ON public."DigitalProduct" 
  FOR SELECT USING (true);

-- Publishers can manage their own products
DROP POLICY IF EXISTS "Publishers can manage their own products" ON public."DigitalProduct";
CREATE POLICY "Publishers can manage their own products" ON public."DigitalProduct" 
  FOR ALL USING (auth.uid()::text = publisher_id);

-- 4. Review Policies (Everyone can view reviews)
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public."Review";
CREATE POLICY "Reviews are viewable by everyone" ON public."Review" 
  FOR SELECT USING (true);

-- 5. Permissions
GRANT SELECT ON public."Category" TO anon, authenticated;
GRANT SELECT ON public."Service" TO anon, authenticated;
GRANT SELECT ON public."DigitalProduct" TO anon, authenticated;
GRANT SELECT ON public."Review" TO anon, authenticated;
