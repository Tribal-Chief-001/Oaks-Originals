-- Supabase Row-Level Security (RLS) Policies Migration Script
-- Run this script in the Supabase SQL Editor to secure the database tables at the engine level.

-- ==========================================
-- 1. FAVORITES TABLE POLICIES
-- ==========================================
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;

-- Select Policy
CREATE POLICY "Users can view their own favorites" 
ON "Favorite" 
FOR SELECT 
USING (auth.uid()::text = "userId");

-- Insert Policy
CREATE POLICY "Users can insert their own favorites" 
ON "Favorite" 
FOR INSERT 
WITH CHECK (auth.uid()::text = "userId");

-- Delete Policy
CREATE POLICY "Users can delete their own favorites" 
ON "Favorite" 
FOR DELETE 
USING (auth.uid()::text = "userId");


-- ==========================================
-- 2. POKEDEX TRACKER TABLE POLICIES
-- ==========================================
ALTER TABLE "PokedexTracker" ENABLE ROW LEVEL SECURITY;

-- Select Policy
CREATE POLICY "Users can view their own tracker items" 
ON "PokedexTracker" 
FOR SELECT 
USING (auth.uid()::text = "userId");

-- Insert Policy
CREATE POLICY "Users can insert their own tracker items" 
ON "PokedexTracker" 
FOR INSERT 
WITH CHECK (auth.uid()::text = "userId");

-- Update Policy
CREATE POLICY "Users can update their own tracker items" 
ON "PokedexTracker" 
FOR UPDATE 
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- Delete Policy
CREATE POLICY "Users can delete their own tracker items" 
ON "PokedexTracker" 
FOR DELETE 
USING (auth.uid()::text = "userId");


-- ==========================================
-- 3. SAVED TEAMS TABLE POLICIES
-- ==========================================
ALTER TABLE "SavedTeam" ENABLE ROW LEVEL SECURITY;

-- Select Policy
CREATE POLICY "Users can view their own teams" 
ON "SavedTeam" 
FOR SELECT 
USING (auth.uid()::text = "userId");

-- Insert Policy
CREATE POLICY "Users can create their own teams" 
ON "SavedTeam" 
FOR INSERT 
WITH CHECK (auth.uid()::text = "userId");

-- Update Policy
CREATE POLICY "Users can update their own teams" 
ON "SavedTeam" 
FOR UPDATE 
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- Delete Policy
CREATE POLICY "Users can delete their own teams" 
ON "SavedTeam" 
FOR DELETE 
USING (auth.uid()::text = "userId");
