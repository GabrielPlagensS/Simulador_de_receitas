-- Schema equivalente ao que o Prisma criava (3 migrações consolidadas).
-- Rode uma vez no banco novo (Neon): psql "$DATABASE_URL" -f db/schema.sql

CREATE TABLE IF NOT EXISTS "User" (
  "id"        TEXT NOT NULL,
  "name"      TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "password"  TEXT NOT NULL,
  "cep"       TEXT NOT NULL,
  "profissao" TEXT NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Course" (
  "id"          TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "hours"       INTEGER NOT NULL,
  "lessons"     INTEGER NOT NULL,
  "level"       TEXT NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "profissao"   TEXT NOT NULL,
  "image"       TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price"       DOUBLE PRECISION NOT NULL,
  "language"    TEXT NOT NULL,
  "userId"      TEXT NOT NULL,
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
