import React from 'react';
import { User, Mail, Lock, Bell, Palette } from 'lucide-react';

export function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Configurações</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm divide-y">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Perfil</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    defaultValue="João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-4 py-2"
                    defaultValue="joao@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    defaultValue="Agência SEO"
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Segurança</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Notificações</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Relatórios</h3>
                    <p className="text-sm text-gray-500">
                      Receber notificações sobre relatórios
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Tarefas</h3>
                    <p className="text-sm text-gray-500">
                      Receber notificações sobre tarefas
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Menu Rápido</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center text-left px-4 py-2 rounded-lg hover:bg-gray-50">
                <User className="w-5 h-5 mr-3 text-gray-400" />
                <span>Editar Perfil</span>
              </button>
              <button className="w-full flex items-center text-left px-4 py-2 rounded-lg hover:bg-gray-50">
                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                <span>Email</span>
              </button>
              <button className="w-full flex items-center text-left px-4 py-2 rounded-lg hover:bg-gray-50">
                <Lock className="w-5 h-5 mr-3 text-gray-400" />
                <span>Senha</span>
              </button>
              <button className="w-full flex items-center text-left px-4 py-2 rounded-lg hover:bg-gray-50">
                <Bell className="w-5 h-5 mr-3 text-gray-400" />
                <span>Notificações</span>
              </button>
              <button className="w-full flex items-center text-left px-4 py-2 rounded-lg hover:bg-gray-50">
                <Palette className="w-5 h-5 mr-3 text-gray-400" />
                <span>Aparência</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}