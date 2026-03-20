import Button from "../../Components/button";
import Input from "../../Components/input";
import { Link } from "react-router-dom";
function login() {
  return (
    <div className="bg-[#f5f9ff] min-h-screen flex items-center justify-center">
      <div className="bg-gray-200 w-100 p-8 rounded-md shadow-md">
        <h1 className="text-center text-5xl font-semibold mb-6 p-4">Login</h1>

        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <Input type="text" />
        </div>

        <div className="mb-6">
          <label className="block mb-1">Senha:</label>
          <Input type="password" />
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
