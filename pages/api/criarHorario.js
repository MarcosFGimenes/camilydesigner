import dbConnect from "../../lib/mongoose";
import Horario from "../../models/Horario";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { data, hora } = req.body;

      if (!data || !hora) {
        return res.status(400).json({ success: false, message: "Preencha todos os campos!" });
      }

      // Formatar a data e a hora corretamente
      const dataHoraFormatada = new Date(`${data}T${hora}:00`);

      if (isNaN(dataHoraFormatada)) {
        return res.status(400).json({ success: false, message: "Data ou hora inválida!" });
      }

      const novoHorario = await Horario.create({ data: dataHoraFormatada, disponivel: true });

      return res.status(201).json({ success: true, horario: novoHorario });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Erro ao criar horário", error });
    }
  }

  return res.status(405).json({ success: false, message: "Método não permitido" });
}
