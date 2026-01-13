import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class GetPublicPortfolioService {
  async execute(id: number) {
    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({
      where: { id: id },
      relations: ["projects"], 
      select: {
        id: true,
        name: true,
        role: true,
        location: true,
        bio: true,
        avatarUrl: true,
        skills: true,
        social: true,
        experiences: true,
        education: true,
      }
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }
}