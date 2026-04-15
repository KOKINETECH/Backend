// src/infrastructure/webserver/controllers/UserController.ts
import { Request, Response } from 'express';
import { AuthInteractor } from '../../../application/usecases/AuthInteractor';

export class UserController {
  constructor(private interactor: AuthInteractor) {}

  onRegister = async (req: Request, res: Response) => {
    try {
      const tokens = await this.interactor.register(req.body);
      res.status(201).json(tokens);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  onLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const tokens = await this.interactor.login(email, password);
      res.json(tokens);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

  onRefresh = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error('Refresh token manquant');
      const tokens = await this.interactor.refresh(refreshToken);
      res.json(tokens);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

  onLogout = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      await this.interactor.logout(refreshToken);
      res.json({ message: 'Déconnecté' });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}