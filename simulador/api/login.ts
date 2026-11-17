import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: "E-mail e senha são obrigatórios." },
        { status: 400 },
      );
    }

    const rows = await sql`
      SELECT id, name, email, password
      FROM "User"
      WHERE email = ${email}
      LIMIT 1
    `;
    const user = rows[0];

    if (!user) {
      return Response.json(
        { message: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    if (user.password !== password) {
      return Response.json({ message: "Senha inválida." }, { status: 401 });
    }

    return Response.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return Response.json({ message: "Erro no servidor." }, { status: 500 });
  }
}
