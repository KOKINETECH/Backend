import { Request, Response } from "express";
import { CreateUser } from "../../../application/usecases/CreateUser";
import { UserRepositoryImpl } from "../../repositories/UserRepositoryImpl";

const repo = new UserRepositoryImpl();
const createUser = new CreateUser(repo);

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      await createUser.execute(req.body);
      res.status(201).json({ message: "User created" });
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  }
}
