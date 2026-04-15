// src/domain/repositories/UserRepository.ts
import { User } from '../entities/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  saveRefreshToken(userId: number, token: string): Promise<void>;
  findRefreshToken(userId: number, token: string): Promise<boolean>;
  deleteRefreshToken(token: string): Promise<void>;
}