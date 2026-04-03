import { useState, useRef } from "react";
import Button from "./button";
import Input from "./input";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // 🔥 importante
};

export default function CreateCourseModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    hours: "",
    lessons: "",
    level: "",
    date: "",
    profissao: "",
    description: "",
    price: "",
    language: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || !user.id) {
    alert("Erro de autenticação");
    return;
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded">
          <p>Você precisa estar logado.</p>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleClickImage() {
    inputRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function handleSubmit() {
    if (!file) {
      alert("Selecione uma imagem");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("userId", user.id);
    formData.append("image", file);

    const response = await fetch("http://localhost:3000/course", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      alert("Erro ao criar curso");
      return;
    }

    alert("Curso criado com sucesso");

    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-300 w-[900px] p-6 rounded-md">
        <div className="flex gap-4 mb-4 items-end">
          <div className="w-50 h-50 bg-white flex items-center justify-center border">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              "Imagem do curso"
            )}
          </div>

          <input
            type="file"
            ref={inputRef}
            onChange={handleFile}
            className="hidden"
          />

          <Button
            title="Enviar imagem"
            onClick={handleClickImage}
            variant="default"
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Título:</label>
              <Input name="title" onChange={handleChange} />
            </div>

            <div className="flex flex-col">
              <label>Profissão:</label>
              <Input name="profissao" onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Horas:</label>
              <Input name="hours" onChange={handleChange} />
            </div>

            <div className="flex flex-col">
              <label>Aulas:</label>
              <Input name="lessons" onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Nível:</label>
              <Input name="level" onChange={handleChange} />
            </div>

            <div className="flex flex-col">
              <label>Data:</label>
              <Input name="date" onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Preço:</label>
              <Input name="price" onChange={handleChange} />
            </div>

            <div className="flex flex-col">
              <label>Idioma:</label>
              <Input name="language" onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col">
            <label>Descrição:</label>
            <textarea
              name="description"
              onChange={handleChange}
              className="w-full border h-20 bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button title="Voltar" onClick={onClose} variant="default" />
          <Button
            title="Salvar Curso"
            onClick={handleSubmit}
            variant="default"
          />
        </div>
      </div>
    </div>
  );
}
