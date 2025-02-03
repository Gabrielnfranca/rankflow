export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          client: string;
          deadline: string;
          priority: 'Alta' | 'Média' | 'Baixa';
          status: 'pendente' | 'em_progresso' | 'concluida';
          type: 'SEO Técnico' | 'Keyword Research' | 'Backlinks' | 'Conteúdo';
          order: number;
          user_id: string;
          created_at: string;
          labels: string[] | null;
          time: string | null;
          color: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          client: string;
          deadline: string;
          priority: 'Alta' | 'Média' | 'Baixa';
          status?: 'pendente' | 'em_progresso' | 'concluida';
          type: 'SEO Técnico' | 'Keyword Research' | 'Backlinks' | 'Conteúdo';
          order?: number;
          user_id: string;
          created_at?: string;
          labels?: string[] | null;
          time?: string | null;
          color?: string | null;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          client?: string;
          deadline?: string;
          priority?: 'Alta' | 'Média' | 'Baixa';
          status?: 'pendente' | 'em_progresso' | 'concluida';
          type?: 'SEO Técnico' | 'Keyword Research' | 'Backlinks' | 'Conteúdo';
          order?: number;
          user_id?: string;
          created_at?: string;
          labels?: string[] | null;
          time?: string | null;
          color?: string | null;
        };
      };
    };
  };
}
