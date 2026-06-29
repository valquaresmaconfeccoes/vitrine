-- Migration: Hero responsivo (art direction) + posição configurável do conteúdo
-- Rode este bloco no Railway → PostgreSQL → aba "Data" (query SQL)
--
-- O que faz:
-- 1. Cria o enum HeroContentPosition (grade 3x3 de posicionamento do texto/CTA)
-- 2. Adiciona a coluna imageMobile (arte vertical opcional para celular)
-- 3. Adiciona a coluna contentPosition (onde o texto/botão aparece sobre a imagem)
--
-- Tudo é idempotente e seguro: pode rodar mais de uma vez sem erro.

-- 1. Enum de posição (DO block para não falhar se já existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'HeroContentPosition') THEN
    CREATE TYPE "HeroContentPosition" AS ENUM (
      'TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT',
      'CENTER_LEFT', 'CENTER_CENTER', 'CENTER_RIGHT',
      'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'
    );
  END IF;
END$$;

-- 2. Coluna da imagem mobile (opcional — se nula, usa a imagem desktop)
ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "imageMobile" TEXT;

-- 3. Coluna de posição do conteúdo (default mantém o comportamento atual)
ALTER TABLE "hero_slides"
  ADD COLUMN IF NOT EXISTS "contentPosition" "HeroContentPosition" NOT NULL DEFAULT 'BOTTOM_CENTER';
