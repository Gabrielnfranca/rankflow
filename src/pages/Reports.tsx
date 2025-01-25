import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

export function Reports() {
  const reports = [
    {
      id: 1,
      title: 'Relatório Mensal - Cliente A',
      type: 'Mensal',
      date: '2024-03-01',
      client: 'Cliente A',
      status: 'Enviado'
    },
    {
      id: 2,
      title: 'Relatório Quinzenal - Cliente B',
      type: 'Quinzenal',
      date: '2024-03-15',
      client: 'Cliente B',
      status: 'Pendente'
    },
    {
      id: 3,
      title: 'Relatório de Backlinks - Cliente C',
      type: 'Especial',
      date: '2024-03-10',
      client: 'Cliente C',
      status: 'Rascunho'
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Novo Relatório
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select className="border rounded-lg px-4 py-2">
              <option>Todos os Clientes</option>
              <option>Cliente A</option>
              <option>Cliente B</option>
              <option>Cliente C</option>
            </select>
            <select className="border rounded-lg px-4 py-2">
              <option>Todos os Tipos</option>
              <option>Mensal</option>
              <option>Quinzenal</option>
              <option>Especial</option>
            </select>
            <select className="border rounded-lg px-4 py-2">
              <option>Todos os Status</option>
              <option>Enviado</option>
              <option>Pendente</option>
              <option>Rascunho</option>
            </select>
            <input
              type="month"
              className="border rounded-lg px-4 py-2"
              defaultValue="2024-03"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relatório
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{report.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'Enviado' ? 'bg-green-100 text-green-800' :
                      report.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}