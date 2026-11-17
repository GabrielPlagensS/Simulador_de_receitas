# Simulador de Receitas

Aplicação web para **infoprodutores** cadastrarem seus cursos e simularem quanto eles podem faturar. A partir do número de leads, do preço, da taxa de conversão e do churn, o simulador estima alunos, receita mensal, receita anual e LTV, e permite exportar o resultado em PDF.

## Funcionalidades

- **Cadastro e login** de usuários (nome, e-mail, senha, documento e profissão).
- **Cadastro de cursos** com imagem, título, profissão, carga horária, número de aulas, nível, preço, idioma e descrição.
- **Listagem dos cursos** do usuário logado, em cards.
- **Simulador de receita** por curso, com preço mascarado em reais (R$).
- **Exportação em PDF** do resultado da simulação.

## Como a simulação é calculada

| Resultado | Fórmula |
| --- | --- |
| Alunos estimados | `leads × (conversão / 100)` |
| Receita mensal | `alunos estimados × preço` |
| Receita anual | `receita mensal × 12` |
| LTV | `(receita anual − receita anual × churn / 100) / alunos estimados` (0 quando o churn é 0) |

## Tecnologias

**Front-end**
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React Router 7](https://reactrouter.com/)
- [jsPDF](https://github.com/parallax/jsPDF) para gerar o PDF

**Back-end (funções serverless)**
- Rotas em `simulador/api/`, no formato de funções da [Vercel](https://vercel.com/)
- [Neon](https://neon.tech/) (PostgreSQL) via `@neondatabase/serverless`
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) para armazenar as imagens dos cursos

## Estrutura do projeto

```
Simulador_de_receitas/
├── README.md
├── package.json
└── simulador/
    ├── api/                  # Funções serverless
    │   ├── register.ts       # POST /api/register
    │   ├── login.ts          # POST /api/login
    │   ├── course.ts         # POST /api/course
    │   └── courses.ts        # GET  /api/courses
    ├── banco/
    │   └── schema.sql        # Criação das tabelas User e Course
    ├── src/
    │   ├── assets/
    │   ├── Components/       # adicionar, simulador, button, input
    │   ├── pages/            # Login e Cadastro
    │   ├── home.tsx          # Listagem de cursos
    │   ├── Router.tsx        # Rotas: /, /login, /cadastro
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

## Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- Um banco PostgreSQL no [Neon](https://neon.tech/)
- Um Blob store na [Vercel](https://vercel.com/) (para o upload de imagens)
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)

### Passo a passo

1. Clone o repositório e instale as dependências:

   ```bash
   git clone https://github.com/GabrielPlagensS/Simulador_de_receitas.git
   cd Simulador_de_receitas/simulador
   npm install
   ```

2. Crie o arquivo `simulador/.env.local` com as variáveis de ambiente:

   ```env
   DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
   BLOB_READ_WRITE_TOKEN="seu_token_do_vercel_blob"
   ```

3. Crie as tabelas no banco (uma única vez):

   ```bash
   psql "$DATABASE_URL" -f banco/schema.sql
   ```

4. Inicie o projeto:

   ```bash
   vercel dev
   ```

   > O comando `npm run dev` sobe apenas o front-end (Vite). As rotas `/api` são funções serverless da Vercel, então use `vercel dev` para rodar front e API juntos.

### Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite (apenas front-end) |
| `npm run build` | Verifica os tipos e gera o build de produção |
| `npm run preview` | Serve localmente o build de produção |
| `npm run lint` | Executa o ESLint |

## API

| Método | Rota | Descrição | Respostas |
| --- | --- | --- | --- |
| `POST` | `/api/register` | Cadastra um usuário. Corpo JSON: `name`, `email`, `password`, `cep`, `profissao` | `201`, `400`, `409` (e-mail já cadastrado), `500` |
| `POST` | `/api/login` | Autentica. Corpo JSON: `email`, `password`. Retorna `id`, `name` e `email` | `200`, `400`, `401`, `404`, `500` |
| `GET` | `/api/courses?userId=<id>` | Lista os cursos do usuário | `200`, `400`, `500` |
| `POST` | `/api/course` | Cria um curso. Corpo `multipart/form-data`: `userId`, `title`, `hours`, `lessons`, `level`, `profissao`, `description`, `price`, `language`, `image` (até 4 MB) | `201`, `400`, `401`, `404`, `413`, `500` |

## Modelo de dados

**User**: `id`, `name`, `email` (único), `password`, `cep`, `profissao`

**Course**: `id`, `title`, `hours`, `lessons`, `level`, `createdAt`, `profissao`, `image`, `description`, `price`, `language`, `userId` (referência a `User`)

## Deploy

O projeto está preparado para a Vercel. Aponte o **Root Directory** para `simulador/` e configure `DATABASE_URL` e `BLOB_READ_WRITE_TOKEN` nas variáveis de ambiente do projeto.

## Próximos passos

- [ ] Armazenar senhas com hash (bcrypt ou argon2) e autenticar por sessão ou token
- [ ] Editar e excluir cursos
- [ ] Salvar o histórico das simulações de cada curso
- [ ] Gráficos de projeção de receita

## Autor

Feito por [GabrielPlagensS](https://github.com/GabrielPlagensS).
