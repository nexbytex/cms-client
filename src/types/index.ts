export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: "TEACHER" | "STUDENT";
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: "TEACHER" | "STUDENT";
}