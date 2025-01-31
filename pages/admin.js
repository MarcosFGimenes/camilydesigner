import { useState } from "react";
import axios from "axios";
import dbConnect from "../lib/mongoose";
import Agendamento from "../models/Agendamento";
import Horario from "../models/Horario";
import Servico from "../models/Servico";
import Link from "next/link";

export default function Admin({ agendamentos, horarios, servicos }) {
  
  const [pagina, setPagina] = useState("agendamentos");
  const [agendamentosList, setAgendamentosList] = useState(agendamentos);
  const [horariosList, setHorariosList] = useState(horarios);
  const [servicosList, setServicosList] = useState(servicos);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [editandoServico, setEditandoServico] = useState(null);
  const [nomeServico, setNomeServico] = useState("");
  const [descricaoServico, setDescricaoServico] = useState("");

  const marcarConcluido = async (id) => {
    await axios.post("/api/concluir", { id });
    setAgendamentosList(agendamentosList.filter((a) => a._id !== id));
  };

  const deletarHorario = async (id) => {
    await axios.post("/api/deletarHorario", { id });
    setHorariosList(horariosList.filter((h) => h._id !== id));
  };

  const adicionarHorario = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/criarHorario", { data, hora });
    setHorariosList([...horariosList, response.data.horario]);
    setData("");
    setHora("");
  };
 
  const adicionarHorariosParaProximosDias = async (dias) => {
    if (!hora || !data) {
      alert("Selecione uma data e um horário antes de adicionar.");
      return;
    }
  
    const dataSelecionada = new Date(data);
    const horariosParaAdicionar = [];
  
    for (let i = 0; i < dias; i++) {
      const novaData = new Date(dataSelecionada);
      novaData.setDate(dataSelecionada.getDate() + i * 7); // Adiciona semanas mantendo o mesmo dia da semana
  
      const dataFormatada = novaData.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  
      horariosParaAdicionar.push({
        data: `${dataFormatada}T${hora}:00`, // Mantém formato ISO 8601
        hora: hora,
      });
    }
  
    try {
      const response = await axios.post("/api/criarHorarios", {
        horarios: horariosParaAdicionar,
      });
  
      setHorariosList([...horariosList, ...response.data.horarios]); // Atualiza a lista corretamente
      setData("");
      setHora("");
      alert("Horários adicionados com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar horários:", error);
      alert("Erro ao adicionar horários. Verifique o console.");
    }
  };
  

  const adicionarServico = async (nome, descricao) => {
    const response = await axios.post("/api/adicionarServico", { nome, descricao });
    setServicosList([...servicosList, response.data.servico]);
    setNomeServico("");
    setDescricaoServico("");
  };

  const editarServico = async (id) => {
    const servico = servicosList.find((s) => s._id === id);
    setEditandoServico(servico);
    setNomeServico(servico.nome);
    setDescricaoServico(servico.descricao);
  };

  const salvarEdicaoServico = async () => {
    const response = await axios.post("/api/editarServico", { id: editandoServico._id, nome: nomeServico, descricao: descricaoServico });
    setServicosList(servicosList.map((s) => (s._id === editandoServico._id ? response.data.servico : s)));
    setEditandoServico(null);
    setNomeServico("");
    setDescricaoServico("");
  };

  const deletarServico = async (id) => {
    await axios.post("/api/deletarServico", { id });
    setServicosList(servicosList.filter((s) => s._id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu lateral */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Painel Admin</h2>
        <nav>
          <ul>
            <li>
              <button onClick={() => setPagina("agendamentos")} className="w-full text-left p-2 hover:bg-gray-200 rounded">
                Agendamentos
              </button>
            </li>
            <li>
              <button onClick={() => setPagina("horarios")} className="w-full text-left p-2 hover:bg-gray-200 rounded">
                Horários
              </button>
            </li>
            <li>
              <button onClick={() => setPagina("servicos")} className="w-full text-left p-2 hover:bg-gray-200 rounded">
                Serviços
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        {pagina === "agendamentos" && (
          <section className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700">Agendamentos Atuais</h2>
            <ul>
              {agendamentosList.length > 0 ? (
                agendamentosList
                  .sort((a, b) => new Date(a.horario.data) - new Date(b.horario.data))
                  .map((agendamento) => (
                    <li key={agendamento._id} className="border-b py-2 flex justify-between items-center">
                      <div>
                        <p><strong>Nome:</strong> {agendamento.nome}</p>
                        <p><strong>Contato:</strong> {agendamento.contato}</p>
                        <p><strong>Serviço:</strong> {agendamento.servico?.nome || "-"}</p>
                        <p><strong>Pagamento:</strong> {agendamento.metodoPagamento}</p>
                        <p><strong>Data/Hora:</strong> {new Date(agendamento.horario?.data).toLocaleString()}</p>
                      </div>
                      <button className="bg-green-500 text-white px-3 py-1 rounded-md" onClick={() => marcarConcluido(agendamento._id)}>Concluir</button>
                    </li>
                  ))
              ) : (
                <p className="text-gray-500">Nenhum agendamento encontrado.</p>
              )}
            </ul>
          </section>
        )}

        {pagina === "horarios" && (
          <section className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700">Horários Disponíveis</h2>
            <ul>
              {horariosList.map((horario) => (
                <li key={horario._id} className="border-b py-2 flex justify-between items-center">
                  <span>{new Date(horario.data).toLocaleString()}</span>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => deletarHorario(horario._id)}>Deletar</button>
                </li>
              ))}
            </ul>
            <form onSubmit={adicionarHorario} className="mt-4">
  <input
    type="date"
    value={data}
    onChange={(e) => setData(e.target.value)}
    required
    className="border p-2 rounded w-full mb-2"
  />
  <input
    type="time"
    value={hora}
    onChange={(e) => setHora(e.target.value)}
    required
    className="border p-2 rounded w-full mb-2"
  />
  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
    Adicionar
  </button>
  <button
    type="button"
    onClick={() => adicionarHorariosParaProximosDias(30)}
    className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
  >
    Adicionar para os próximos 30 dias
  </button>
  <button
    type="button"
    onClick={() => adicionarHorariosParaProximosDias(60)}
    className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
  >
    Adicionar para os próximos 60 dias
  </button>
</form>
          </section>
        )}

        {pagina === "servicos" && (
          <section className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700">Serviços</h2>
            <ul>
              {servicosList.map((servico) => (
                <li key={servico._id} className="border-b py-2 flex justify-between items-center">
                  <div>
                    <p><strong>Nome:</strong> {servico.nome}</p>
                    <p><strong>Descrição:</strong> {servico.descricao}</p>
                  </div>
                  <div>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2" onClick={() => editarServico(servico._id)}>Editar</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => deletarServico(servico._id)}>Deletar</button>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editandoServico) {
                salvarEdicaoServico();
              } else {
                adicionarServico(nomeServico, descricaoServico);
              }
            }} className="mt-4">
              <input name="nome" placeholder="Nome do Serviço" value={nomeServico} onChange={(e) => setNomeServico(e.target.value)} required className="border p-2 rounded w-full mb-2" />
              <input name="descricao" placeholder="Descrição" value={descricaoServico} onChange={(e) => setDescricaoServico(e.target.value)} required className="border p-2 rounded w-full mb-2" />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">{editandoServico ? "Salvar Edição" : "Adicionar Serviço"}</button>
              {editandoServico && (
                <button type="button" onClick={() => setEditandoServico(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2">Cancelar Edição</button>
              )}
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  
  const agendamentos = await Agendamento.find({ concluido: false }).populate("horario").populate("servico").sort({ "horario.data": 1 }) || [];
  const horarios = await Horario.find({ disponivel: true }) || [];
  const servicos = await Servico.find({}) || [];

  return {
    props: {
      agendamentos: JSON.parse(JSON.stringify(agendamentos)),
      horarios: JSON.parse(JSON.stringify(horarios)),
      servicos: JSON.parse(JSON.stringify(servicos)),
    },
  };
}