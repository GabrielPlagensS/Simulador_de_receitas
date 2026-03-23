import Button from "../../Components/button";
import Input from "../../Components/input";
import { Link } from "react-router-dom";
import { useState } from "react";
function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      if (!email || !password) {
        setError("E-mail e senha são obrigátorios");
        return;
      }

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 404) {
        setError("Usuário não encontrado");
      }
      if (response.status === 400) {
        setError("Usuário e senha são obrigatorios");
      }
      if (response.status === 200) {
        setError("");
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return (
    <div
      className="bg-[#f5f9ff] min-h-screen flex items-center justify-center"
      onSubmit={handleSubmit}
    >
      <div className="bg-gray-200 w-100 p-8 rounded-md shadow-md">
        <h1 className="text-center text-5xl font-semibold mb-6 p-4">Login</h1>

        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <Input type="text" onChange={(e) => setEmail(e.target.value)} />

          <label className="block mb-1">Senha:</label>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-sm font-bold text-red-500">{error}</p>
        </div>

        <div className="flex flex-col gap-4 py-2.5">
          <Link to="/">
            <Button title="Login" variant="default" />
          </Link>

          <Link to="/cadastro">
            <Button title="Cadastrar" variant="default" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default login;
