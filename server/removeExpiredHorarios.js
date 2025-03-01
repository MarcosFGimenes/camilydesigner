import dbConnect from "../lib/mongoose.js";
import Horario from "../models/Horario.js";

// Função para deletar horários expirados
const removerHorariosExpirados = async () => {
  try {
    await dbConnect();

    const agora = new Date();
    agora.setSeconds(0, 0); // Remove segundos e milissegundos para garantir precisão

    const resultado = await Horario.deleteMany({
      disponivel: true,
      data: { $lte: agora }, // Exclui horários que já passaram
    });

    console.log(`[${new Date().toLocaleString("pt-BR")}] Horários removidos: ${resultado.deletedCount}`);
  } catch (error) {
    console.error("Erro ao remover horários expirados:", error);
  }
};

// Rodar a cada minuto para verificar horários vencidos
setInterval(removerHorariosExpirados, 60 * 1000);

console.log("🕒 Monitoramento de horários iniciado...");
