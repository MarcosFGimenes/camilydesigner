import { useState } from "react";
import axios from "axios";
import dbConnect from "../lib/mongoose";
import Agendamento from "../models/Agendamento";
import Horario from "../models/Horario";
import Servico from "../models/Servico";

export default function Admin({ agendamentos, horarios, servicos }) {
  const [agendamentosList, setAgendamentosList] = useState(agendamentos);
  const [horariosList, setHorariosList] = useState(horarios);
  const [servicosList, setServicosList] = useState(servicos);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  const marcarConcluido = async (id) => {
    await axios.post("/api/concluir", { id });
    setAgendamentosList(agendamentosList.filter((a) => a._id !== id));
  };

  const deletarHorario = async (id) => {
    await axios.post("/api/deletarHorario", { id });
    setHorariosList(horariosList.filter((h) => h._id !== id));
  };

  const adicionarServico = async (nome, descricao) => {
    const response = await axios.post("/api/adicionarServico", { nome, descricao });
    setServicosList([...servicosList, response.data.servico]);
  };

  const adicionarHorario = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/criarHorario", { data, hora });
    setHorariosList([...horariosList, response.data.horario]);
    setData("");
    setHora("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Painel Admin</h1>
      
      {/* Agendamentos */}
      <section className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Agendamentos</h2>
        <ul>
          {agendamentosList.length > 0 ? (
            agendamentosList.map((agendamento) => (
              <li key={agendamento._id} className="border-b py-2 flex justify-between items-center">
                <span>{agendamento.nome} - {new Date(agendamento.horario?.data).toLocaleString()}</span>
                <button className="bg-green-500 text-white px-3 py-1 rounded-md" onClick={() => marcarConcluido(agendamento._id)}>Concluir</button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Nenhum agendamento encontrado.</p>
          )}
        </ul>
      </section>

      {/* Horários */}
      <section className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Horários Disponíveis</h2>
        <ul>
          {horariosList.length > 0 ? (
            horariosList.map((horario) => (
              <li key={horario._id} className="border-b py-2 flex justify-between items-center">
                <span>{new Date(horario.data).toLocaleString()}</span>
                <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => deletarHorario(horario._id)}>Deletar</button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Nenhum horário disponível.</p>
          )}
        </ul>
        
        {/* Formulário Adicionar Horário */}
        <form onSubmit={adicionarHorario} className="mt-4">
          <div className="flex gap-2">
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} required className="border p-2 rounded w-full" />
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required className="border p-2 rounded w-full" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Adicionar</button>
        </form>
      </section>

      {/* Serviços */}
      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-700">Serviços</h2>
        <ul>
          {servicosList.map((servico) => (
            <li key={servico._id} className="border-b py-2">{servico.nome}</li>
          ))}
        </ul>
        
        {/* Formulário Adicionar Serviço */}
        <form onSubmit={(e) => {
          e.preventDefault();
          adicionarServico(e.target.nome.value, e.target.descricao.value);
        }} className="mt-4">
          <input name="nome" placeholder="Nome do Serviço" required className="border p-2 rounded w-full mb-2" />
          <input name="descricao" placeholder="Descrição" required className="border p-2 rounded w-full mb-2" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Adicionar Serviço</button>
        </form>
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  
  const agendamentos = await Agendamento.find({ concluido: false }).populate("horario").populate("servico") || [];
  const horarios = await Horario.find({ disponivel: true }) || [];
  const servicos = await Servico.find({}) || [];

  return {
    props: {
      agendamentos: JSON.parse(JSON.stringify(agendamentos || [])),
      horarios: JSON.parse(JSON.stringify(horarios || [])),
      servicos: JSON.parse(JSON.stringify(servicos || [])),
    },
  };
}
