export type UserRole = 'admin' | 'specialist' | 'client'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  specialist_id: string
  client_id: string
  status: 'active' | 'paused' | 'completed'
  backlink_budget: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  category: 'technical_seo' | 'keyword_research' | 'backlink' | 'content'
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface Backlink {
  id: string
  project_id: string
  url: string
  target_url: string
  cost: number
  status: 'pending' | 'active' | 'expired'
  purchase_date?: string
  created_at: string
  updated_at: string
}

export interface ProgressReport {
  id: string
  project_id: string
  title: string
  content?: string
  month: string
  created_at: string
  updated_at: string
}
