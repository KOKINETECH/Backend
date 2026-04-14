import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(user: User) {
    await this.userRepository.create(user);
  }
}
