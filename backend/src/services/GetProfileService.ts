import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class GetProfileService {
  async execute(userId: number) {
    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({
      where: { id: userId },
      relations: ["projects"],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true, 
        bio: true,      
        avatarUrl: true,
        skills: true,   
        social: true,   
        experiences: true, 
        education: true    
      }
    });

    if (!user) {
      return new Error("Usuário não encontrado");
    }

    return user;
  }
}