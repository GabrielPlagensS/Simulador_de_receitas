import express, { type Request, type Response } from "express";
import { connection, prisma } from "./src/db.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

connection();

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({ message: "E-mail e senha são obrigatórios." });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email, password },
    });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor." });
    return;
  }
});

app.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, cep } = req.body;

    if (!name || !email || !password || !cep) {
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
      data: { name: name, email: email, password: password, cep: cep },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
    return;
  }
});

app.listen(3000, () => {
  console.log("Servidor na porta 3000");
});
