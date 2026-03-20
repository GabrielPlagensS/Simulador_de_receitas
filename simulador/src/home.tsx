import { Link } from "react-router";
import Profe from "./assets/user.png";
import Mais from "./assets/plus.png";

function home() {
  return (
    <div className="bg-[#f5f9ff]  min-h-screen">
      <div className="bg-[#1163C8]">
        <div className="flex justify-end items-center w-full p-3 gap-2 al-auto">
          <img className="p-1 w-14" src={Mais} alt="Adicionar-curso" />
          <Link to="./login">
            <img className="p-1 w-14" src={Profe} alt="professor-login" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default home;
