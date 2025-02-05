import dbConnect from "../../lib/mongoose";
import Horario from "../../models/Horario";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { data } = req.body;

      console.log("Dados recebidos no backend:", { data }); // Log para depuração

      if (!data) {
        return res.status(400).json({ success: false, message: "Preencha todos os campos!" });
      }

      // Converte a data ISO 8601 para um objeto Date
      const dataHoraUTC = new Date(data);

      // Verifica se a data é válida
      if (isNaN(dataHoraUTC)) {
        return res.status(400).json({ success: false, message: "Data ou hora inválida!" });
      }

      console.log("Data recebida (UTC):", dataHoraUTC); // Log para depuração

      // Cria o horário no banco de dados
      const novoHorario = await Horario.create({ data: dataHoraUTC, disponivel: true });

      console.log("Horário criado com sucesso:", novoHorario); // Log para depuração

      return res.status(201).json({ success: true, horario: novoHorario });
    } catch (error) {
      console.error("Erro no backend:", error); // Log para depuração
      return res.status(500).json({ success: false, message: "Erro ao criar horário", error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: "Método não permitido" });
}