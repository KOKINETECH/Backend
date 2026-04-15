// src/application/usecases/AuthInteractor.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, AuthTokens } from '../../domain/entities/User';

export class AuthInteractor {
  constructor(private userRepository: UserRepository) {}

  private generateTokens(user: User): AuthTokens {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

  async register(userData: User): Promise<AuthTokens> {
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) throw new Error('Email déjà utilisé');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    const tokens = this.generateTokens(newUser);
    await this.userRepository.saveRefreshToken(newUser.id!, tokens.refreshToken);
    return tokens;
  }

  async login(email: string, plainPassword: string): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Identifiants invalides');

    const match = await bcrypt.compare(plainPassword, user.password);
    if (!match) throw new Error('Identifiants invalides');

    const tokens = this.generateTokens(user);
    await this.userRepository.saveRefreshToken(user.id!, tokens.refreshToken);
    return tokens;
  }

  async refresh(oldRefreshToken: string): Promise<AuthTokens> {
    // Vérifier et décoder le refresh token
    let payload: any;
    try {
      payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch {
      throw new Error('Refresh token invalide');
    }

    const userId = payload.id;
    const isValid = await this.userRepository.findRefreshToken(userId, oldRefreshToken);
    if (!isValid) throw new Error('Refresh token révoqué');

    // Récupérer l'utilisateur
    const user = await this.userRepository.findByEmail(payload.email); // on n'a pas de méthode findById, on ajuste
    if (!user) throw new Error('Utilisateur introuvable');

    // Supprimer l'ancien refresh token
    await this.userRepository.deleteRefreshToken(oldRefreshToken);

    // Générer de nouveaux tokens
    const newTokens = this.generateTokens(user);
    await this.userRepository.saveRefreshToken(user.id!, newTokens.refreshToken);
    return newTokens;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.userRepository.deleteRefreshToken(refreshToken);
  }
}