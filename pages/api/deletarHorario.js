import dbConnect from '../../lib/mongoose';
import Horario from '../../models/Horario';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { id } = req.body;
      await Horario.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
