
-- Habilitar la extensión para generar UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Perfiles (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  neighborhood TEXT,
  role TEXT CHECK (role IN ('client', 'merchant')),
  business_id TEXT, -- ID del comercio que gestiona el comerciante
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabla de Reseñas (reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  user_name TEXT,
  user_photo TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabla de Favoritos (favorites)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  business_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, business_id)
);

-- 4. Tabla de Sugerencias de Comercios (business_suggestions)
CREATE TABLE IF NOT EXISTS business_suggestions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  address TEXT,
  user_id TEXT,
  user_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Tabla de Comercios (businesses) - Ya debería existir por el Seed, pero por las dudas:
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  image TEXT,
  rating NUMERIC,
  review_count INTEGER,
  distance TEXT,
  category_id TEXT,
  address TEXT,
  phone TEXT,
  description TEXT,
  tags TEXT[],
  is_open BOOLEAN,
  schedule JSONB,
  coordinates JSONB,
  owner_email TEXT, -- Email del dueño del comercio
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Tabla de Promociones (promotions) - Ya debería existir por el Seed:
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  image TEXT,
  business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
  business_name TEXT,
  business_type TEXT,
  business_logo TEXT,
  expires TEXT,
  discount TEXT,
  category_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- CONFIGURACIÓN DE SEGURIDAD (RLS)
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Perfiles públicos son visibles por todos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuarios pueden insertar su propio perfil" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para reviews
CREATE POLICY "Reseñas son visibles por todos" ON reviews FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados pueden insertar reseñas" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios pueden borrar sus propias reseñas" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Políticas para favorites
CREATE POLICY "Usuarios ven sus propios favoritos" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios insertan sus propios favoritos" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios borran sus propios favoritos" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Políticas para business_suggestions
CREATE POLICY "Sugerencias visibles por admin" ON business_suggestions FOR SELECT USING (auth.jwt() ->> 'email' = 'robertovizgarra@gmail.com');
CREATE POLICY "Cualquiera puede insertar sugerencias" ON business_suggestions FOR INSERT WITH CHECK (true);

-- Políticas para businesses y promotions (Lectura pública)
CREATE POLICY "Comercios visibles por todos" ON businesses FOR SELECT USING (true);
CREATE POLICY "Promociones visibles por todos" ON promotions FOR SELECT USING (true);
CREATE POLICY "Admin puede gestionar comercios" ON businesses FOR ALL USING (auth.jwt() ->> 'email' = 'robertovizgarra@gmail.com');
CREATE POLICY "Admin puede gestionar promociones" ON promotions FOR ALL USING (auth.jwt() ->> 'email' = 'robertovizgarra@gmail.com');
