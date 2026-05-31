
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.carbon_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  electricity_usage NUMERIC NOT NULL DEFAULT 0,
  fuel_consumption NUMERIC NOT NULL DEFAULT 0,
  travel_distance NUMERIC NOT NULL DEFAULT 0,
  electricity_emissions NUMERIC NOT NULL DEFAULT 0,
  fuel_emissions NUMERIC NOT NULL DEFAULT 0,
  travel_emissions NUMERIC NOT NULL DEFAULT 0,
  total_emissions NUMERIC NOT NULL DEFAULT 0,
  eco_score NUMERIC NOT NULL DEFAULT 0,
  sustainability_rating TEXT NOT NULL DEFAULT 'Moderate',
  annual_projection NUMERIC NOT NULL DEFAULT 0,
  trees_needed NUMERIC NOT NULL DEFAULT 0,
  earths_needed NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX carbon_entries_user_created_idx ON public.carbon_entries(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carbon_entries TO authenticated;
GRANT ALL ON public.carbon_entries TO service_role;
ALTER TABLE public.carbon_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entries_select_own" ON public.carbon_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "entries_insert_own" ON public.carbon_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "entries_update_own" ON public.carbon_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "entries_delete_own" ON public.carbon_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);
