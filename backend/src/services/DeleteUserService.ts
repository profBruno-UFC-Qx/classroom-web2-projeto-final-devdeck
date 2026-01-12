import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { compare } from "bcryptjs";

interface DeleteRequest {
  userId: number;
  password: string;
}

export class DeleteUserService {
  async execute({ userId, password }: DeleteRequest) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id: userId });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Senha incorreta. Não foi possível excluir a conta.");
    }
    
    await repo.delete(userId);

    return true;
  }
}