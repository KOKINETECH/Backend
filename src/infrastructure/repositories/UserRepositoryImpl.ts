import { db } from "../database/mysql";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class UserRepositoryImpl implements UserRepository {
  async create(user: User): Promise<void> {
    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [user.name, user.email, user.password]
    );
  }
}
