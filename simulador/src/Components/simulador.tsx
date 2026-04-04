import { useState } from "react";
import jsPDF from "jspdf";
import Button from "./button";
import Input from "./input";

type Course = {
  id: string;
  title: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
};

// - No input the preco colocar uma máscara para exibir R$ 100,00

export default function SimuladorModal({ isOpen, onClose, course }: Props) {
  const [students, setStudents] = useState(0);
  const [price, setPrice] = useState("");
  const [conversion, setConversion] = useState(0);
  const [churn, setChurn] = useState(0);

  const [resultado, setResultado] = useState({
    mensal: 0,
    anual: 0,
    ltv: 0,
    alunos: 0,
  });

  if (!isOpen || !course) return null;
  const courseData = course;

  function simular() {
    const alunosEstimados = students * (conversion / 100);
    const numericPrice = Number(price.replace(/\D/g, "")) / 100;
    const receitaMensal = alunosEstimados * numericPrice;
    const receitaAnual = receitaMensal * 12;
    const ltv =
      churn > 0
        ? (receitaAnual - receitaAnual * (churn / 100)) / alunosEstimados
        : 0;

    setResultado({
      mensal: receitaMensal,
      anual: receitaAnual,
      ltv,
      alunos: alunosEstimados,
    });
  }
  function formatCurrency(value: string) {
    const numeric = value.replace(/\D/g, "");
    const number = Number(numeric) / 100;

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function gerarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Simulador de Receita", 10, 10);

    doc.setFontSize(12);
    doc.text(`Curso: ${courseData.title}`, 10, 20);

    doc.text(
      `Receita mensal: ${resultado.mensal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`,
      10,
      30,
    );

    doc.text(
      `Receita anual: ${resultado.anual.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`,
      10,
      40,
    );

    doc.text(
      `LTV estimado: ${resultado.ltv.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`,
      10,
      50,
    );

    doc.text(`Alunos estimados: ${resultado.alunos.toFixed(0)}`, 10, 60);

    doc.save(`simulacao-${courseData.title}.pdf`);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-200 w-[900px] p-8 rounded-md">
        <h1 className="text-4xl text-center mb-8">Simulador de receita</h1>

        <div className="space-y-4">
          <div>
            <label>Título do curso: {courseData.title}</label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Total de Leads:</label>
              <Input
                type="number"
                onChange={(e) => setStudents(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label>Preço do curso:</label>
              <Input
                name="price"
                type="text"
                value={price}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  console.log();
                  setPrice(formatCurrency(raw));
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Taxa de conversão(%):</label>
              <Input
                type="number"
                onChange={(e) => setConversion(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label>Churn:</label>
              <Input
                type="number"
                onChange={(e) => setChurn(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            title="Executar Simulação"
            onClick={simular}
            variant="default"
          />
        </div>

        <div className="mt-10">
          <h2 className="text-3xl mb-6 text-center">Resultado:</h2>

          <div className="space-y-2">
            <p>
              Receita mensal:{" "}
              {resultado.mensal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>

            <p>
              Receita anual:{" "}
              {resultado.anual.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>

            <p>
              LTV:{" "}
              {resultado.ltv.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>

            <p>Alunos estimados: {resultado.alunos.toFixed(0)}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <Button title="Fechar" onClick={onClose} variant="default" />
          <Button title="Gerar PDF" onClick={gerarPDF} variant="default" />
        </div>
      </div>
    </div>
  );
}
