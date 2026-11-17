import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get("userId");

    if (!userId) {
      return Response.json({ message: "userId é obrigatório" }, { status: 400 });
    }

    // "createdAt" AT TIME ZONE 'UTC' faz a data sair em UTC (como o Prisma fazia),
    // independente do fuso da máquina onde a função roda.
    const courses = await sql`
      SELECT id, title, hours, lessons, level,
             "createdAt" AT TIME ZONE 'UTC' AS "createdAt",
             profissao, image, description, price, language, "userId"
      FROM "Course"
      WHERE "userId" = ${userId}
    `;

    return Response.json(courses, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    return Response.json({ message: "Erro ao buscar cursos" }, { status: 500 });
  }
}
