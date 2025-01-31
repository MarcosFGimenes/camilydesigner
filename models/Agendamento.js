import mongoose from 'mongoose';

const AgendamentoSchema = new mongoose.Schema({
  nome: String,
  contato: String,
  servico: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico' },
  metodoPagamento: String,
  horario: { type: mongoose.Schema.Types.ObjectId, ref: 'Horario' },
  concluido: { type: Boolean, default: false },
});

export default mongoose.models.Agendamento || mongoose.model('Agendamento', AgendamentoSchema);