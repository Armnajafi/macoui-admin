// Shared TypeScript interfaces

export interface Project {
  id: string
  title: string
  activity: string
  broker: string
  location: string
  status: string
  date: string
}

export interface Article {
  id: number
  thumbnail?: string
  title: string
  category: string
  author: string
  status: string
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  date: string
}

export interface Broker {
  id: string
  name: string
  company: string
  location: string
  status: string
  date: string
}

export interface Document {
  id: string
  title: string
  category: string
  author: string
  status: string
  date: string
}

export interface LogEntry {
  id: string
  time: string
  action: string
  logId: string
}

export interface LogGroup {
  date: string
  entries: LogEntry[]
}

export interface StatsItem {
  title: string
  value: string | number
}

export interface DashboardStats {
  activeProjects: number
  pendingProjects: number
  brokers: number
  newUsers: number
}

export interface ActivityItem {
  icon: string
  text: string
  date: string
}
