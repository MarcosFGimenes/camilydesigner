import mongoose from 'mongoose';

const ServicoSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
});

export default mongoose.models.Servico || mongoose.model('Servico', ServicoSchema);