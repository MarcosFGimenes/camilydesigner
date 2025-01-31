import { useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import dbConnect from '../lib/mongoose';
import Horario from '../models/Horario';
import Servico from '../models/Servico';
import { useRouter } from 'next/router';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Agendar({ horarios, servicos }) {
  const { register, handleSubmit } = useForm();
  const [horariosDisponiveis, setHorariosDisponiveis] = useState(horarios);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const router = useRouter();
  const sliderRef = useRef(null);

  const handleServiceSelection = (serviceId) => {
    setSelectedService(serviceId);
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Resetar o horário selecionado ao mudar a data
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
  };

  const onSubmit = async (data) => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Por favor, selecione um serviço, data e horário.');
      return;
    }

    const response = await axios.post('/api/agendar', {
      ...data,
      servico: selectedService,
      horario: selectedTime,
    });

    if (response.data.success) {
      alert('Agendamento realizado com sucesso!');
      setHorariosDisponiveis(horariosDisponiveis.filter(h => h._id !== selectedTime));
      router.push({
        pathname: '/comprovante',
        query: {
          nome: data.nome,
          contato: data.contato,
          servico: servicos.find(s => s._id === selectedService)?.nome || '',
          metodoPagamento: data.metodoPagamento,
          horario: new Date(selectedTime).toLocaleString(),
          endereco: 'Rua Exemplo, 123, Centro - Cidade/UF'
        }
      });
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      }
    ]
  };

  // Função para formatar o dia da semana
  const getDiaSemana = (date) => {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias[new Date(date).getDay()];
  };

  // Função para formatar a data no formato DIA/MÊS
  const formatarData = (date) => {
    const data = new Date(date);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
  };

  // Função para ordenar as datas por proximidade e dia da semana
  const ordenarDatas = (dates) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Ignorar horas, minutos, segundos e milissegundos

    return dates
      .map(date => new Date(date))
      .sort((a, b) => {
        const diffA = Math.abs(a - hoje);
        const diffB = Math.abs(b - hoje);
        return diffA - diffB;
      })
      .map(date => date.toDateString());
  };

  // Obter as datas únicas e ordenadas
  const datasOrdenadas = ordenarDatas([...new Set(horariosDisponiveis.map(h => new Date(h.data).toDateString()))]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Agendar Horário</h1>

      {/* Seleção de Serviço */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Selecione um Serviço</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {servicos.map(servico => (
            <div
              key={servico._id}
              onClick={() => handleServiceSelection(servico._id)}
              className={`p-4 border rounded-lg cursor-pointer ${selectedService === servico._id ? 'bg-blue-100' : ''}`}
            >
              <h3 className="font-medium text-lg">{servico.nome}</h3>
              <p className="text-sm text-gray-600">{servico.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seleção de Data */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Selecione uma Data</h2>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => sliderRef.current.slickPrev()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            &laquo; Anterior
          </button>
          <button
            onClick={() => sliderRef.current.slickNext()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Próximo &raquo;
          </button>
        </div>
        <Slider ref={sliderRef} {...settings}>
          {datasOrdenadas.map(date => (
            <div
              key={date}
              onClick={() => handleDateSelection(date)}
              className={`p-2 border rounded-lg cursor-pointer text-center ${selectedDate === date ? 'bg-blue-100' : ''}`}
            >
              <div className="text-sm font-semibold">{getDiaSemana(date)}</div>
              <div className="text-lg">{formatarData(date)}</div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Seleção de Horário */}
      {selectedDate && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Selecione um Horário</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {horariosDisponiveis
              .filter(horario => new Date(horario.data).toDateString() === selectedDate)
              .map(horario => (
                <div
                  key={horario._id}
                  onClick={() => handleTimeSelection(horario._id)}
                  className={`p-2 border rounded-lg cursor-pointer text-center ${selectedTime === horario._id ? 'bg-blue-100' : ''}`}
                >
                  {new Date(horario.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Formulário de Agendamento */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('nome')}
          placeholder="Nome"
          required
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          {...register('contato')}
          placeholder="Contato"
          required
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          {...register('metodoPagamento')}
          required
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão">Cartão</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
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