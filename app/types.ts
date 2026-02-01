export interface UserPreferences {
  sleepStart: string; // "01:00"
  sleepEnd: string; // "07:00"
}

export interface AppSettings {
  apiKey: string;
  setupComplete: boolean;
}

export interface Todo {
  id: string;
  title: string;
  dueDate: string; // "YYYY-MM-DD"
  dueTime: string; // "HH:MM"
  category: string;
  warning: string | null;
  completed: boolean;
  fileName?: string; // 첨부 파일명 (목업)
  createdAt: string;
}

export interface ParsePreferencesRequest {
  text: string;
}

export interface ParsePreferencesResponse {
  success: boolean;
  sleepStart?: string;
  sleepEnd?: string;
  error?: string;
}

export interface ParseTodoRequest {
  text: string;
  userPreferences: UserPreferences | null;
  currentDate: string;
  currentTime: string;
}

export interface ParseTodoResponse {
  success: boolean;
  title?: string;
  dueDate?: string;
  dueTime?: string;
  category?: string;
  warning?: string | null;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  todos: Todo[];
  userPreferences: UserPreferences | null;
  currentDate: string;
  currentTime: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}
