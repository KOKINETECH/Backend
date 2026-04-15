// src/domain/entities/User.ts
export interface User {
  id?: number;
  email: string;
  password: string;
  role: 'client' | 'technicien' | 'admin';
  is_verified?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}