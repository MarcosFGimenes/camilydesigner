// pages/api/editarServico.js
import dbConnect from "../../lib/mongoose";
import Servico from "../../models/Servico";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    try {
      const { id, nome, descricao } = req.body;

      // Verifica se o ID foi fornecido
      if (!id) {
        return res.status(400).json({ success: false, message: "ID do serviço não fornecido." });
      }

      // Atualiza o serviço no banco de dados
      const servicoAtualizado = await Servico.findByIdAndUpdate(
        id,
        { nome, descricao },
        { new: true } // Retorna o documento atualizado
      );

      if (!servicoAtualizado) {
        return res.status(404).json({ success: false, message: "Serviço não encontrado." });
      }

      return res.status(200).json({ success: true, servico: servicoAtualizado });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Erro ao editar serviço.", error: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Método não permitido." });
  }
}