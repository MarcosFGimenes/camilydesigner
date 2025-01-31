import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import dbConnect from '../lib/mongoose';
import Horario from '../models/Horario';
import Servico from '../models/Servico';
import { useRouter } from 'next/router';


export default function Agendar({ horarios, servicos }) {
  const { register, handleSubmit } = useForm();
  const [horariosDisponiveis, setHorariosDisponiveis] = useState(horarios);

  const router = useRouter();

  const onSubmit = async (data) => {
    const response = await axios.post('/api/agendar', data);
    if (response.data.success) {
      alert('Agendamento realizado com sucesso!');
      setHorariosDisponiveis(horariosDisponiveis.filter(h => h._id !== data.horario));
  
      // Redirecionar para a página do comprovante com os dados do agendamento
      router.push({
        pathname: '/comprovante',
        query: { 
          nome: data.nome, 
          contato: data.contato, 
          servico: servicos.find(s => s._id === data.servico)?.nome || '',
          metodoPagamento: data.metodoPagamento, 
          horario: new Date(horarios.find(h => h._id === data.horario)?.data).toLocaleString(),
          endereco: 'Rua Exemplo, 123, Centro - Cidade/UF' // Substitua pelo endereço correto
        }
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Agendar Horário</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input 
          {...register('nome')} 
          placeholder="Nome" 
          required 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <input 
          {...register('contato')} 
          placeholder="Contato" 
          required 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <select 
          {...register('servico')} 
          required 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {servicos.map(servico => (
            <option key={servico._id} value={servico._id}>{servico.nome}</option>
          ))}
        </select>
        <select 
          {...register('metodoPagamento')} 
          required 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão">Cartão</option>
        </select>
        <select 
          {...register('horario')} 
          required 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {horariosDisponiveis.map(horario => (
            <option key={horario._id} value={horario._id}>{new Date(horario.data).toLocaleString()}</option>
          ))}
        </select>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Agendar
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  const horarios = await Horario.find({ disponivel: true });
  const servicos = await Servico.find({});
  return {
    props: {
      horarios: JSON.parse(JSON.stringify(horarios)),
      servicos: JSON.parse(JSON.stringify(servicos)),
    },
  };
}
