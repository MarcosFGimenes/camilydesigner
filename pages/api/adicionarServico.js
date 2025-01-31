import dbConnect from '../../lib/mongoose';
import Servico from '../../models/Servico';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();
    const { nome, descricao } = req.body;
    const servico = new Servico({ nome, descricao });
    await servico.save();
    res.status(200).json({ success: true, servico });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}