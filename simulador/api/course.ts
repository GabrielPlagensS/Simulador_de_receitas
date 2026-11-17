import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";

const sql = neon(process.env.DATABASE_URL!);

// Limite de corpo das Vercel Functions é ~4,5 MB; deixamos uma folga.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const text = (name: string) => {
      const value = form.get(name);
      return typeof value === "string" ? value : "";
    };

    const userId = text("userId");
    const title = text("title");

    if (!userId) {
      return Response.json({ message: "Não autorizado" }, { status: 401 });
    }

    if (!title) {
      return Response.json({ message: "Título é obrigatório" }, { status: 400 });
    }

    const users = await sql`SELECT id FROM "User" WHERE id = ${userId} LIMIT 1`;

    if (users.length === 0) {
      return Response.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    // Imagem: vai para o Vercel Blob (o disco da função não é persistente)
    let imageUrl = "";
    const file = form.get("image");

    if (file && typeof file !== "string" && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return Response.json(
          { message: "O arquivo precisa ser uma imagem" },
          { status: 400 },
        );
      }
      if (file.size > MAX_IMAGE_BYTES) {
        return Response.json(
          { message: "A imagem deve ter no máximo 4 MB" },
          { status: 413 },
        );
      }

      const blob = await put(`courses/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      imageUrl = blob.url;
    }

    const createdAtRaw = text("createdAt");
    const createdAt = createdAtRaw
      ? new Date(`${createdAtRaw}T00:00:00.000Z`)
      : new Date();

    if (Number.isNaN(createdAt.getTime())) {
      return Response.json({ message: "Data inválida" }, { status: 400 });
    }

    const id = crypto.randomUUID();

    const rows = await sql`
      INSERT INTO "Course"
        (id, title, hours, lessons, level, "createdAt", profissao,
         image, description, price, language, "userId")
      VALUES
        (${id}, ${title}, ${Number(text("hours")) || 0},
         ${Number(text("lessons")) || 0}, ${text("level")},
         ${createdAt.toISOString()}::timestamp, ${text("profissao")},
         ${imageUrl}, ${text("description")}, ${Number(text("price")) || 0},
         ${text("language")}, ${userId})
      RETURNING id, title, hours, lessons, level,
                "createdAt" AT TIME ZONE 'UTC' AS "createdAt",
                profissao, image, description, price, language, "userId"
    `;

    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    return Response.json({ message: "Erro ao criar curso" }, { status: 500 });
  }
}
