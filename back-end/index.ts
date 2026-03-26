import express, { type Request, type Response } from "express";
import { connection, prisma } from "./src/db.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.urlencoded({ extended: true }));

connection();

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "E-mail e senha são obrigatórios.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Senha inválida.",
      });
    }

    // ✅ retorna só o necessário
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro no servidor.",
    });
  }
});

app.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, cep, profissao } = req.body;

    if (!name || !email || !password || !cep || !profissao) {
      res
        .status(400)
        .json({ message: "Todas as informações são obrigatórias" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (user?.email) {
      res.status(409).json({ message: "E-mail já cadastrado" });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        cep: cep,
        profissao: profissao,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
    return;
  }
});

app.post("/course", async (req: Request, res: Response) => {
  try {
    const { title, description, price, userId } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        userId,
      },
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar curso" });
  }
});

app.listen(3000, () => {
  console.log("Servidor na porta 3000");
});
