import mongoose from 'mongoose';

const HorarioSchema = new mongoose.Schema({
  data: Date,
  disponivel: { type: Boolean, default: true },
});

export default mongoose.models.Horario || mongoose.model('Horario', HorarioSchema);