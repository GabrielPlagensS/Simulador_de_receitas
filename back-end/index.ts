import express, { type Request, type Response } from "express";
import { connection, prisma } from "./src/db.js";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

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
      return res.status(400).json({
        message: "Todas as informações são obrigatórias",
      });
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      return res.status(409).json({
        message: "E-mail já cadastrado",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        cep,
        profissao,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({
      message: "Erro no servidor",
    });
  }
});

app.post("/course", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      hours,
      lessons,
      level,
      createdAt,
      profissao,
      description,
      price,
      language,
      userId,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    if (!title) {
      return res.status(400).json({ message: "Título é obrigatório" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // 🔥 IMAGEM REAL
    const imageUrl = req.file
      ? `http://localhost:3000/uploads/${req.file.filename}`
      : "";

    const course = await prisma.course.create({
      data: {
        title,
        hours: Number(hours) || 0,
        lessons: Number(lessons) || 0,
        level: level || "",
        createdAt: createdAt
          ? new Date(createdAt + "T00:00:00.000Z")
          : new Date(),
        profissao: profissao || "",
        description: description || "",
        price: Number(price) || 0,
        language: language || "",
        image: imageUrl,
        user: {
          connect: { id: userId },
        },
      },
    });

    return res.status(201).json(course);
  } catch (error) {
    console.log("ERRO REAL:", error);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    return res.status(500).json({ message: "Erro ao criar curso" });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId é obrigatório" });
    }

    const courses = await prisma.course.findMany({
      where: {
        userId: String(userId),
      },
    });

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar cursos" });
  }
});

app.listen(3000, () => {
  console.log("Servidor na porta 3000");
});
