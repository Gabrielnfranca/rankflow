export interface Task {
  id: number;
  title: string;
  description?: string;
  client: string;
  deadline: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'pendente' | 'em_progresso' | 'concluida';
  type: 'SEO Técnico' | 'Keyword Research' | 'Backlinks' | 'Conteúdo';
  task_order: number;
  user_id: string;
  created_at?: string;
  labels?: string[];
  time?: string;
  color?: string;
}
