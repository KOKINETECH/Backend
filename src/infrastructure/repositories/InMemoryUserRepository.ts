import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  private refreshTokens: { userId: number; token: string }[] = [];
  private currentId = 1;

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async create(user: User): Promise<User> {
    const newUser = { ...user, id: this.currentId++, is_verified: false };
    this.users.push(newUser);
    return newUser;
  }

  async saveRefreshToken(userId: number, token: string): Promise<void> {
    this.refreshTokens.push({ userId, token });
  }

  async findRefreshToken(userId: number, token: string): Promise<boolean> {
    return this.refreshTokens.some(rt => rt.userId === userId && rt.token === token);
  }

  async deleteRefreshToken(token: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
  }
}