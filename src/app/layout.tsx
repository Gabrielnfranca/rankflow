import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RankFlow - Plataforma Inteligente de SEO',
  description: 'Gerencie seu SEO de forma inteligente e eficiente com RankFlow. Monitore rankings, otimize conteúdo e supere a concorrência.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full bg-gray-900">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-screen">
          {/* Navigation */}
          <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                      RankFlow
                    </span>
                  </Link>
                  <div className="hidden md:block ml-10">
                    <div className="flex items-center space-x-4">
                      <Link href="/features" className="nav-link">
                        Funcionalidades
                      </Link>
                      <Link href="/pricing" className="nav-link">
                        Preços
                      </Link>
                      <Link href="/about" className="nav-link">
                        Sobre
                      </Link>
                      <Link href="/blog" className="nav-link">
                        Blog
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-4">
                    <Link href="/login" className="nav-link">
                      Login
                    </Link>
                    <Link href="/signup" className="btn-primary">
                      Começar Grátis
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="bg-gray-800/30 border-t border-gray-700/50">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Produto</h3>
                  <ul className="mt-4 space-y-2">
                    <li><Link href="/features" className="text-gray-400 hover:text-white">Funcionalidades</Link></li>
                    <li><Link href="/pricing" className="text-gray-400 hover:text-white">Preços</Link></li>
                    <li><Link href="/integrations" className="text-gray-400 hover:text-white">Integrações</Link></li>
                    <li><Link href="/changelog" className="text-gray-400 hover:text-white">Changelog</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Empresa</h3>
                  <ul className="mt-4 space-y-2">
                    <li><Link href="/about" className="text-gray-400 hover:text-white">Sobre</Link></li>
                    <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                    <li><Link href="/careers" className="text-gray-400 hover:text-white">Carreiras</Link></li>
                    <li><Link href="/contact" className="text-gray-400 hover:text-white">Contato</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Recursos</h3>
                  <ul className="mt-4 space-y-2">
                    <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentação</Link></li>
                    <li><Link href="/guides" className="text-gray-400 hover:text-white">Guias</Link></li>
                    <li><Link href="/api" className="text-gray-400 hover:text-white">API</Link></li>
                    <li><Link href="/support" className="text-gray-400 hover:text-white">Suporte</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Legal</h3>
                  <ul className="mt-4 space-y-2">
                    <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacidade</Link></li>
                    <li><Link href="/terms" className="text-gray-400 hover:text-white">Termos</Link></li>
                    <li><Link href="/security" className="text-gray-400 hover:text-white">Segurança</Link></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 border-t border-gray-700/50 pt-8">
                <p className="text-center text-gray-400">
                  {new Date().getFullYear()} RankFlow. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
