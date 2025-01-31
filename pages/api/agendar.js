import dbConnect from '../../lib/mongoose';
import Agendamento from '../../models/Agendamento';
import Horario from '../../models/Horario';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { nome, contato, servico, metodoPagamento, horario } = req.body;

      // Atualiza o horário para indisponível
      await Horario.findByIdAndUpdate(horario, { disponivel: false });

      const agendamento = new Agendamento({
        nome,
        contato,
        servico,
        metodoPagamento,
        horario,
        concluido: false
      });

      await agendamento.save();
      res.status(201).json({ success: true, agendamento });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
