'use client'

import { motion } from 'framer-motion'
import { RiRocketLine, RiSearchEyeLine, RiLineChartLine, RiTeamLine } from 'react-icons/ri'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-6">
            RankFlow
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Gerencie seu SEO de forma inteligente e eficiente. Uma plataforma completa para 
            otimização, análise e crescimento orgânico.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dashboard"
              className="btn-primary text-lg px-8 py-3"
            >
              Começar Agora
            </Link>
            <a 
              href="#features"
              className="btn-secondary text-lg px-8 py-3"
            >
              Saiba Mais
            </a>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tudo que você precisa para impulsionar seu SEO em uma única plataforma
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <RiSearchEyeLine className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">SEO Técnico</h3>
              <p className="text-gray-400">
                Análise completa e otimização técnica do seu site para melhor performance nos buscadores
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <RiLineChartLine className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Análise de Rankings</h3>
              <p className="text-gray-400">
                Monitore suas posições e acompanhe o progresso das suas palavras-chave
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <RiTeamLine className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Gestão de Clientes</h3>
              <p className="text-gray-400">
                Organize seus projetos e clientes em um único lugar com relatórios profissionais
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <RiRocketLine className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Backlinks</h3>
              <p className="text-gray-400">
                Monitore e gerencie seus backlinks para fortalecer sua autoridade
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para melhorar seu SEO?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Comece agora mesmo a otimizar seu site e alcance melhores posições nos buscadores
            </p>
            <Link 
              href="/dashboard"
              className="bg-white text-primary-600 hover:bg-gray-100 transition-colors px-8 py-3 rounded-lg font-medium text-lg inline-block"
            >
              Criar Conta Grátis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            &copy; 2024 RankFlow. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
