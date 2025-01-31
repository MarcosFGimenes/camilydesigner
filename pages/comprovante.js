import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Comprovante() {
  const router = useRouter();
  const { nome, contato, servico, metodoPagamento, horario, endereco } = router.query;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl text-center">
      <h1 className="text-2xl font-bold text-gray-800">Comprovante de Agendamento</h1>
      <p className="text-gray-600 mt-2">Siga as instruções e compareça ao local no horário agendado.</p>

      <div className="mt-6 text-left space-y-4">
        <p><strong>Nome:</strong> {nome}</p>
        <p><strong>Contato:</strong> {contato}</p>
        <p><strong>Serviço:</strong> {servico}</p>
        <p><strong>Método de Pagamento:</strong> {metodoPagamento}</p>
        <p><strong>Data e Horário:</strong> {horario}</p>
        <p><strong>Endereço:</strong> {endereco}</p>
        <p className="text-red-600"><strong>Importante:</strong> Chegue 10 a 15 minutos antes do horário marcado.</p>
      </div>

      <Link href="/" className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
        Voltar à Página Inicial
      </Link>
    </div>
  );
}
