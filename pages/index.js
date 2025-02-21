import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-lilac-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-500 text-white py-20 text-center">
        <h1 className="text-6xl font-extrabold tracking-wide">
          Bem-vindo à <span className="text-black">Camily Designer</span>
        </h1>
        <p className="mt-6 text-lg font-light">
          Onde elegância e beleza se encontram. Descubra o poder de um olhar.
        </p>
        <Link
          href="/agendar"
          className="mt-8 inline-block bg-black text-white font-bold py-3 px-10 rounded-lg hover:bg-gray-800 transition-all duration-200"
        >
          Agendar Seu Horário
        </Link>
      </header>

      {/* About Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center space-y-10 lg:space-y-0 lg:space-x-10">
          <div className="lg:w-1/2">
            {/* Espaço para foto da profissional */}
            <div className="h-96 w-full bg-gray-200 rounded-lg shadow-lg overflow-hidden">
              {/* Substitua pelo <img> */}
            </div>
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-purple-700">
              Sobre Camily Designer
            </h2>
            <p className="mt-4 text-gray-700 text-lg">
              Camily Designer é especialista em realçar a beleza natural, com uma experiência de mais de 5 anos em design e estética. Com um olhar atento e dedicação, transformamos cada atendimento em uma experiência única e inesquecível.
            </p>
            <p className="mt-4 text-gray-700 text-lg">
              Cada detalhe é cuidadosamente planejado para garantir que você sinta-se mais confiante e linda.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-lilac-100 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-purple-700">
            Nossos Serviços
          </h2>
          <p className="mt-4 text-gray-700 text-lg">
            Escolha o serviço ideal para transformar seu olhar.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-bold text-purple-700">Design de Sobrancelhas</h3>
            <p className="mt-2 text-gray-600">
              Um design que valoriza sua expressão com precisão e estilo.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-bold text-purple-700">Maquiagem Profissional</h3>
            <p className="mt-2 text-gray-600">
              Maquiagem que realça sua beleza natural para ocasiões especiais.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-bold text-purple-700">Tratamentos Faciais</h3>
            <p className="mt-2 text-gray-600">
              Tratamentos que renovam e revitalizam a pele.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-purple-700">
            Depoimentos de Clientes
          </h2>
          <p className="mt-4 text-gray-700 text-lg">
            O que nossas clientes dizem sobre nós.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 shadow-lg rounded-lg p-6">
            <p className="text-gray-600">
              "Adorei o atendimento e o resultado dos meus cílios. Ficaram perfeitos e super naturais! Obrigada!"
            </p>
            <p className="text-purple-700 font-bold mt-4">- Fernanda Lima</p>
          </div>
          <div className="bg-gray-100 shadow-lg rounded-lg p-6">
            <p className="text-gray-600">
              "Experiência incrível! Me senti especial em cada detalhe. O Studio é lindo e o atendimento impecável!"
            </p>
            <p className="text-purple-700 font-bold mt-4">- Juliana Pereira</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <footer className="bg-gradient-to-r from-purple-700 to-purple-500 text-white py-16 text-center">
        <h2 className="text-4xl font-extrabold">
          Agende Seu Horário na Camily Designer
        </h2>
        <p className="mt-4 text-lg">
          Dê o primeiro passo para realçar sua beleza. Estamos esperando por você!
        </p>
        <Link
          href="/agendar"
          className="mt-6 inline-block bg-black text-white font-bold py-3 px-10 rounded-lg hover:bg-gray-800 transition-all duration-200"
        >
          Agendar Agora
        </Link>
        <p className="mt-10 text-sm text-gray-300">
          Desenvolvido por{" "}
          <a
            href="https://marcosgimenes.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold hover:underline"
          >
            Marcos Gimenes
          </a>
        </p>
      </footer>
    </div>
  );
}