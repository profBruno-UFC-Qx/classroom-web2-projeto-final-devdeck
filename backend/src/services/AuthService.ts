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
    const user = await repo.findOne({
      where: { email },
      select: ["id", "name", "email", "password", "role", "avatarUrl"] 
    });

    if (!user) {
      throw new Error("Email ou senha incorretos");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email ou senha incorretos");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("Erro crítico: Variável JWT_SECRET não definida no ambiente.");
    }

    const token = sign(
      {
        id: user.id,
        role: user.role, 
        name: user.name
      },
      secret, 
      {
        subject: String(user.id),
        expiresIn: "1d",
      }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl 
      }
    };
  }
}