import Input from "../../Components/input";
import Button from "../../Components/button";
import { Link } from "react-router-dom";
import { useState } from "react";

function cadas() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cep, setCep] = useState("");
  const [error, setError] = useState("");
  const [profissao, setProfissao] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      if (!name || !email || !password || !cep || !profissao) {
        alert("Todas as informações são obrigatorias");
        return;
      }

      if (password !== confirmPassword) {
        setError("Senhas não conferem");
        return;
      }

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name, email, password, cep }),
      });

      switch (response.status) {
        case 409:
          setError("E-mail já cadastrado");
          break;
        case 400:
          setError("Todas as informações são obrigatorias");
          break;
        case 201:
          setName("");
          setEmail("");
          setPassword("");
          setCep("");
          setError("");
          break;
        case 500:
          setError("Tente novamente mais tarde");
          break;
        default:
          setError("");
      }

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.log(error);
      return;
    }

    console.log(email, password, name, cep);
  }

  return (
    <div
      className="bg-[#f5f9ff] min-h-screen flex items-center justify-center"
      onSubmit={handleSubmit}
    >
      <div className="bg-gray-200 w-100 p-8 rounded-md shadow-md">
        <h1 className="text-center text-5xl font-semibold mb-6 p-4">
          Cadastro
        </h1>
        <div className="mb-4">
          <label className="block mb-1">Nome:</label>
          <Input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />

          <label className="block mb-1">Email:</label>
          <Input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <label className="block mb-1">Senha:</label>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <label className="block mb-1">Confirmar senha:</label>
          <Input
            placeholder="Confirme sua senha"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />

          <label className="block mb-1">CPF:</label>
          <Input
            type="text"
            onChange={(e) => setCep(e.target.value)}
            value={cep}
          />

          <label className="block mb-1">Profissão:</label>
          <Input
            type="text"
            onChange={(e) => setProfissao(e.target.value)}
            value={profissao}
          />
          <p className="font-bold text-red-500">{error}</p>
        </div>

        <div className="flex flex-col gap-4 py-2.5">
          <Link to="/login">
            <Button title="Cadastrar" variant="default" />
          </Link>

          <Link to="/login">
            <Button title="Login" variant="default" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default cadas;
