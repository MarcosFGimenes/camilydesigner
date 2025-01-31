// pages/api/deletarServico.js
import dbConnect from "../../lib/mongoose";
import Servico from "../../models/Servico";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    try {
      const { id } = req.body;

      // Verifica se o ID foi fornecido
      if (!id) {
        return res.status(400).json({ success: false, message: "ID do serviço não fornecido." });
      }

      // Deleta o serviço do banco de dados
      const servicoDeletado = await Servico.findByIdAndDelete(id);

      if (!servicoDeletado) {
        return res.status(404).json({ success: false, message: "Serviço não encontrado." });
      }

      return res.status(200).json({ success: true, message: "Serviço deletado com sucesso." });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Erro ao deletar serviço.", error: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Método não permitido." });
  }
}