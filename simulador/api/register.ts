import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { name, email, password, cep, profissao } = await request.json();

    if (!name || !email || !password || !cep || !profissao) {
      return Response.json(
        { message: "Todas as informações são obrigatórias" },
        { status: 400 },
      );
    }

    const existing = await sql`
      SELECT id FROM "User" WHERE email = ${email} LIMIT 1
    `;

    if (existing.length > 0) {
      return Response.json({ message: "E-mail já cadastrado" }, { status: 409 });
    }

    const id = crypto.randomUUID();

    // A senha não volta na resposta (o back antigo devolvia o usuário inteiro).
    const rows = await sql`
      INSERT INTO "User" (id, name, email, password, cep, profissao)
      VALUES (${id}, ${name}, ${email}, ${password}, ${cep}, ${profissao})
      RETURNING id, name, email, cep, profissao
    `;

    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    // 23505 = violação de unicidade (dois cadastros simultâneos com o mesmo e-mail)
    if ((error as { code?: string }).code === "23505") {
      return Response.json({ message: "E-mail já cadastrado" }, { status: 409 });
    }
    console.error("Erro no cadastro:", error);
    return Response.json({ message: "Erro no servidor" }, { status: 500 });
  }
}
