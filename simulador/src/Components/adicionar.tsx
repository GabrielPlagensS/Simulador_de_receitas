import { useState } from "react";
import Button from "./button";
import Input from "./input";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateCourseModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({
    title: "",
    hours: "",
    lessons: "",
    level: "",
    date: "",
    profissao: "",
    description: "",
    learning: "",
    price: "",
    language: "",
    modules: "",
    certificate: "",
  });

  if (!isOpen) return null;

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    await fetch("http://localhost:3000/course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        userId: user.id,
      }),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-300 w-225 p-6 rounded-md">
        <div className="flex gap-2 mb-4">
          <div className="w-50 h-50 bg-white flex items-center justify-center border">
            Imagem do curso
          </div>
          <Button title="Enviar imagem" variant="default" />
        </div>

        <div className="space-y-3">
          <div>
            <label>Título do curso:</label>
            <Input name="title" onChange={handleChange} />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label>Total de horas:</label>
              <Input name="hours" onChange={handleChange} />
            </div>

            <div className="flex-1">
              <label>Total de Aulas:</label>
              <Input name="lessons" onChange={handleChange} />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label>Nível do curso:</label>
              <Input name="level" onChange={handleChange} />
            </div>

            <div className="flex-1">
              <label>Data de criação:</label>
              <Input name="date" onChange={handleChange} />
            </div>
          </div>

          <div>
            <label>Profissão abordada:</label>
            <Input name="profissao" onChange={handleChange} />
          </div>

          <div>
            <label>Descrição do curso:</label>
            <textarea
              name="description"
              onChange={handleChange}
              className="w-full border h-20 bg-white"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label>Preço do curso:</label>
              <Input name="price" onChange={handleChange} />
            </div>

            <div className="flex-1">
              <label>Idioma do curso:</label>
              <Input name="language" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex justify-end gap-4 mt-6">
          <Button title="Voltar" variant="default" onClick={onClose} />
          <Button
            title=" Salvar Curso"
            variant="default"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
