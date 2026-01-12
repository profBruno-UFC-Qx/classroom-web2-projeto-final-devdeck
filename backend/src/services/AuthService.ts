import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

type AuthRequest = {
  email: string;
  password: string;
};

export class AuthService {
  async execute({ email, password }: AuthRequest) {
    const repo = AppDataSource.getRepository(User);

    // Busca o usuário pelo email
    const user = await repo.findOne({
      where: { email },
      select: ["id", "name", "email", "password", "role"] 
    });

    if (!user) {
      throw new Error("Email ou senha incorretos");
    }

    // Compara a senha enviada com a criptografada
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email ou senha incorretos");
    }

    //  Obtém o segredo do .env 
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("Erro crítico: Variável JWT_SECRET não definida no ambiente.");
    }

    // Gera o Token JWT usando o segredo do ambiente
    const token = sign(
      {
        id: user.id,
        role: user.role, 
        name: user.name
      },
      secret, 
      {
        subject: String(user.id),
        expiresIn: "1d", // O token vale por 1 dia
      }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}