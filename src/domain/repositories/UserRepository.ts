import { User } from '../entities/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;          // ← retourne l'utilisateur créé (avec son id)
  saveRefreshToken(userId: number, token: string): Promise<void>;
  findRefreshToken(userId: number, token: string): Promise<boolean>;
  deleteRefreshToken(token: string): Promise<void>;
}