import dbConnect from "../../lib/mongoose";
import Horario from "../../models/Horario";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    try {
      const { horarios } = req.body;

      // Verifica se há horários para adicionar
      if (!horarios || horarios.length === 0) {
        return res.status(400).json({ success: false, message: "Nenhum horário fornecido." });
      }

      // Valida e converte as datas para objetos Date
      const horariosValidados = horarios.map((horario) => {
        const dataHoraUTC = new Date(horario.data);
        if (isNaN(dataHoraUTC)) {
          throw new Error("Formato de data inválido: " + horario.data);
        }
        return { ...horario, data: dataHoraUTC };
      });

      // Cria os horários no banco de dados
      const horariosCriados = await Horario.insertMany(horariosValidados);

      return res.status(201).json({ success: true, horarios: horariosCriados });
    } catch (error) {
      console.error("Erro ao criar horários:", error); // Log do erro no console
      return res.status(500).json({ success: false, message: "Erro ao criar horários: " + error.message, error: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Método não permitido." });
  }
}