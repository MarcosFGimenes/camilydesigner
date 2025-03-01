import { useState } from "react";
import axios from "axios";
import dbConnect from "../lib/mongoose";
import Agendamento from "../models/Agendamento";
import Horario from "../models/Horario";
import Servico from "../models/Servico";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

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
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [dataDestino, setDataDestino] = useState("");

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
  
    // Cria a data com a hora selecionada
    const dataHora = new Date(`${data}T${hora}:00`);
    const fusoHorario = "America/Sao_Paulo"; // Fuso horário de São Paulo
  
    // Ajusta a data para garantir que está no fuso horário de São Paulo
    const dataHoraAjustada = new Date(dataHora.toLocaleString("en-US", { timeZone: fusoHorario }));
  
    // Converte para ISO 8601 (UTC) para o backend
    const dataHoraISO = dataHoraAjustada.toISOString();
  
    console.log("Dados enviados:", { data: dataHoraISO }); // Log para depuração
  
    try {
      const response = await axios.post("/api/criarHorario", { data: dataHoraISO });
      console.log("Resposta do backend:", response.data); // Log para depuração
  
      setHorariosList([...horariosList, response.data.horario]);
      setData("");
      setHora("");
    } catch (error) {
      console.error("Erro ao adicionar horário:", error.response ? error.response.data : error.message); // Log detalhado
      alert("Erro ao adicionar horário. Verifique o console.");
    }
  };
  
  const copiarHorariosParaData = async () => {
    if (!dataDestino || horariosSelecionados.length === 0) {
      alert("Selecione uma data e pelo menos um horário para copiar.");
      return;
    }
  
    const horariosParaAdicionar = horariosSelecionados.map((horario) => {
      const dataHoraOriginal = new Date(horario.data);
  
      // Cria a nova data com o mesmo horário, mas na data de destino
      const dataHoraDestino = new Date(dataDestino);
      dataHoraDestino.setHours(dataHoraOriginal.getHours());
      dataHoraDestino.setMinutes(dataHoraOriginal.getMinutes());
      dataHoraDestino.setSeconds(dataHoraOriginal.getSeconds());
      dataHoraDestino.setMilliseconds(dataHoraOriginal.getMilliseconds());
  
      // Usando a função toLocaleString para lidar com o fuso horário local
      const fusoHorario = "America/Sao_Paulo"; // Fuso horário de São Paulo
      const dataHoraISO = new Date(dataHoraDestino.toLocaleString('en-US', { timeZone: fusoHorario }));
  
      return {
        data: dataHoraISO.toISOString(),
      };
    });
  
    try {
      const response = await axios.post("/api/criarHorarios", {
        horarios: horariosParaAdicionar,
      });
  
      setHorariosList([...horariosList, ...response.data.horarios]);
      setHorariosSelecionados([]);
      setDataDestino("");
      alert("Horários copiados com sucesso!");
    } catch (error) {
      console.error("Erro ao copiar horários:", error);
      alert("Erro ao copiar horários. Verifique o console.");
    }
  };
  
  const adicionarHorariosParaProximosDias = async (dias) => {
    if (!hora || !data) {
      alert("Selecione uma data e um horário antes de adicionar.");
      return;
    }

    const dataSelecionada = new Date(`${data}T${hora}:00`);
    const horariosParaAdicionar = [];

    for (let i = 0; i < dias; i++) {
      const novaData = new Date(dataSelecionada);
      novaData.setDate(dataSelecionada.getDate() + i); // Adiciona um dia por vez, sem pular semanas

      // Converte para ISO 8601 (UTC)
      const dataHoraISO = novaData.toISOString();

      horariosParaAdicionar.push({
        data: dataHoraISO,
      });
    }

    try {
      const response = await axios.post("/api/criarHorarios", {
        horarios: horariosParaAdicionar,
      });

      setHorariosList([...horariosList, ...response.data.horarios]);
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
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={horariosSelecionados.some((h) => h._id === horario._id)}
                      onChange={() => {
                        if (horariosSelecionados.some((h) => h._id === horario._id)) {
                          setHorariosSelecionados(horariosSelecionados.filter((h) => h._id !== horario._id));
                        } else {
                          setHorariosSelecionados([...horariosSelecionados, horario]);
                        }
                      }}
                      className="mr-2"
                    />
                    <span>{new Date(horario.data).toLocaleString()}</span>
                  </label>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => deletarHorario(horario._id)}>Deletar</button>
                </li>
              ))}
            </ul>

            {/* Formulário para copiar horários */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Copiar Horários para uma Nova Data</h3>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dataDestino}
                  onChange={(e) => setDataDestino(e.target.value)}
                  required
                  className="border p-2 rounded"
                />
                <button
                  onClick={copiarHorariosParaData}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Copiar horários para o dia: {dataDestino}
                </button>
              </div>
            </div>

            {/* Formulário para adicionar novos horários */}
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
  const socket = io("http://localhost:3000"); // Ajuste para a URL do seu servidor em produção
} 
  export default function Admin({ agendamentos }) {
  const [agendamentosList, setAgendamentosList] = useState(agendamentos);

  useEffect(() => {
    // Escuta novos agendamentos em tempo real
    socket.on("novoAgendamento", (novoAgendamento) => {
      setAgendamentosList((prev) => [...prev, novoAgendamento]);
    });

    return () => {
      socket.off("novoAgendamento");
    };
  }, []);

  return (
    <div>
      <h2>Agendamentos</h2>
      <ul>
        {agendamentosList.map((agendamento) => (
          <li key={agendamento._id}>
            {agendamento.nome} - {agendamento.servico}
          </li>
        ))}
      </ul>
    </div>
  ); }
