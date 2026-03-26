import { Link } from "react-router-dom";
import { useState } from "react";
import Profe from "./assets/user.png";
import Mais from "./assets/plus.png";
import CreateCourseModal from "./Components/adicionar";

function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#f5f9ff] min-h-screen">
      <div className="bg-[#1163C8]">
        <div className="flex justify-end items-center w-full p-3 gap-2">
          <img
            className="p-1 w-14 cursor-pointer"
            src={Mais}
            alt="Adicionar-curso"
            onClick={() => setOpen(true)}
          />

          <Link to="/login">
            <img className="p-1 w-14" src={Profe} alt="professor-login" />
          </Link>
        </div>
      </div>
      <CreateCourseModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default Home;
