import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with 3D Animation */}
      <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-secondary-500/20 animate-gradient"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 transform">
            <div className="h-[50rem] w-[90rem] [mask-image:radial-gradient(closest-side,white,transparent)] bg-gradient-to-r from-primary-500/30 via-secondary-500/30 to-primary-500/30 blur-2xl"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-4 py-1 text-sm leading-6 text-gray-300 ring-1 ring-gray-700/10 hover:ring-gray-700/20">
                Novo recurso disponível{' '}
                <a href="#" className="font-semibold text-primary-400">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Saiba mais <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <h1 className="mb-8 bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
              Revolucione seu SEO com IA
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl">
              Potencialize seus resultados com nossa plataforma all-in-one de SEO. 
              Combine análise avançada de dados, inteligência artificial e automação 
              para dominar os rankings de busca.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup" 
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 p-px text-lg font-semibold leading-6 text-white">
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <span className="relative rounded-full bg-gray-900 px-6 py-3 transition-colors duration-300 group-hover:bg-transparent">
                  Comece Gratuitamente
                </span>
              </Link>
              <Link href="/demo" 
                className="group inline-flex items-center gap-x-2 text-lg font-semibold leading-6 text-white">
                <span>Agendar Demo</span>
                <svg 
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Features Grid with Hover Effects */}
          <div className="mx-auto mt-32 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards */}
              <div className="group relative">
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-20 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200"></div>
                <div className="relative h-full rounded-xl bg-gray-800/50 p-8 backdrop-blur-sm ring-1 ring-white/10 transition duration-300 group-hover:ring-white/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600/10 group-hover:bg-primary-600/20">
                    <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    Análise em Tempo Real
                  </h3>
                  <p className="mt-2 text-gray-400">
                    Monitore suas posições e métricas importantes com atualizações em tempo real e insights acionáveis.
                  </p>
                  <div className="mt-6">
                    <a href="#" className="text-sm font-semibold text-primary-400 hover:text-primary-300">
                      Saiba mais →
                    </a>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-secondary-500 to-primary-500 opacity-20 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200"></div>
                <div className="relative h-full rounded-xl bg-gray-800/50 p-8 backdrop-blur-sm ring-1 ring-white/10 transition duration-300 group-hover:ring-white/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-600/10 group-hover:bg-secondary-600/20">
                    <svg className="h-6 w-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    Otimização com IA
                  </h3>
                  <p className="mt-2 text-gray-400">
                    Receba sugestões personalizadas de otimização baseadas em IA e dados em tempo real.
                  </p>
                  <div className="mt-6">
                    <a href="#" className="text-sm font-semibold text-secondary-400 hover:text-secondary-300">
                      Saiba mais →
                    </a>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-20 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200"></div>
                <div className="relative h-full rounded-xl bg-gray-800/50 p-8 backdrop-blur-sm ring-1 ring-white/10 transition duration-300 group-hover:ring-white/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600/10 group-hover:bg-primary-600/20">
                    <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    Relatórios Avançados
                  </h3>
                  <p className="mt-2 text-gray-400">
                    Gere relatórios profissionais e insights acionáveis para tomar decisões estratégicas.
                  </p>
                  <div className="mt-6">
                    <a href="#" className="text-sm font-semibold text-primary-400 hover:text-primary-300">
                      Saiba mais →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section with Animation */}
          <div className="mx-auto mt-32 max-w-7xl">
            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Clientes Satisfeitos', value: '2,000+' },
                { label: 'Keywords Monitoradas', value: '1M+' },
                { label: 'Páginas Otimizadas', value: '500K+' },
                { label: 'ROI Médio', value: '300%' },
              ].map((stat) => (
                <div key={stat.label} className="group relative">
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-20 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200"></div>
                  <div className="relative rounded-xl bg-gray-800/50 p-8 backdrop-blur-sm ring-1 ring-white/10">
                    <dt className="text-sm font-medium text-gray-400">{stat.label}</dt>
                    <dd className="mt-2 text-3xl font-bold text-white">{stat.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient Animation */}
      <section className="relative py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="relative isolate overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-secondary-800"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-secondary-500/30 animate-gradient"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
            
            <div className="relative px-6 py-24 sm:px-24 sm:py-32">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Pronto para transformar seu SEO?
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Junte-se a milhares de empresas que já estão usando o RankFlow para dominar os resultados de busca.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link href="/signup" 
                    className="group relative inline-flex items-center justify-center rounded-full p-px text-lg font-semibold leading-6 text-white">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-70 transition-opacity duration-300 group-hover:opacity-100"></span>
                    <span className="relative rounded-full bg-gray-900/50 px-6 py-3 transition-colors duration-300 group-hover:bg-transparent">
                      Comece Agora
                    </span>
                  </Link>
                  <Link href="/contact" 
                    className="group inline-flex items-center gap-x-2 text-lg font-semibold leading-6 text-white">
                    <span>Fale Conosco</span>
                    <svg 
                      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
