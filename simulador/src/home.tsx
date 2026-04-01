import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Profe from "./assets/user.png";
import Mais from "./assets/plus.png";
import CreateCourseModal from "./Components/adicionar";
import SimuladorModal from "./Components/simulador";

function Home() {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [openSimulate, setOpenSimulate] = useState(false);

  function handleOpen() {
    if (!user) {
      alert("Você precisa estar logado para criar um curso");
      return;
    }
    setOpen(true);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) return;

    fetch(`http://localhost:3000/courses?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.log(err));
  }, []);

  async function fetchCourses() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) return;

    const res = await fetch(`http://localhost:3000/courses?userId=${user.id}`);

    const data = await res.json();
    setCourses(data);
  }
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="bg-[#f5f9ff] min-h-screen">
      {/* HEADER */}
      <div className="bg-[#1163C8]">
        <div className="flex justify-end items-center w-full p-3 gap-2">
          <img
            className="p-1 w-14 cursor-pointer"
            src={Mais}
            alt="Adicionar-curso"
            onClick={handleOpen}
          />

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Sair
            </button>
          ) : (
            <Link to="/login">
              <img className="p-1 w-14" src={Profe} alt="professor-login" />
            </Link>
          )}
        </div>
      </div>

      <CreateCourseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchCourses}
      />

      <div className="text-center">
        <p className="text-5xl p-6">Seus cursos</p>
      </div>

      <div className="grid grid-cols-3 gap-6 px-10">
        {courses.map((course) => (
          <div
            key={course.id}
            className="relative bg-white p-4 rounded shadow-md"
          >
            <button
              onClick={() => {
                setSelectedCourse(course);
                setOpenSimulate(true);
              }}
              className="absolute top-2 right-2 px-2 py-1 rounded hover:bg-gray-200 text-lg"
            >
              ⋮
            </button>

            <div className="w-full h-40 flex items-center justify-center">
              {course.image ? (
                <img
                  src={course.image}
                  className="max-w-[120px] max-h-[120px] object-contain"
                />
              ) : (
                "Sem imagem"
              )}
            </div>

            <h2 className="font-bold text-lg mt-2">{course.title}</h2>
          </div>
        ))}
      </div>
      <SimuladorModal
        isOpen={openSimulate}
        onClose={() => setOpenSimulate(false)}
        course={selectedCourse}
      />
    </div>
  );
}

export default Home;
