import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { compare, hash } from "bcryptjs";

interface PasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
}

export class UpdatePasswordService {
  async execute({ userId, currentPassword, newPassword }: PasswordRequest) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id: userId });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    //Verifica se a senha atual bate com a do banco
    const passwordMatch = await compare(currentPassword, user.password);

    if (!passwordMatch) {
      throw new Error("A senha atual está incorreta.");
    }

    // Criptografa a nova senha
    const passwordHash = await hash(newPassword, 8);

    // Salva
    user.password = passwordHash;
    await repo.save(user);

    return { message: "Senha atualizada com sucesso." };
  }
}