import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

type ProfileRequest = {
  userId: number;
  name?: string;
  role?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  skills?: string[];
  social?: any;
  experiences?: any[];
  education?: any[];
};

export class UpdateProfileService {
  async execute(data: ProfileRequest) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id: data.userId });

    if (!user) {
      return new Error("Usuário não encontrado");
    }

    // Atribuição segura dos campos
    user.name = data.name ?? user.name;
    user.role = data.role ?? user.role;
    user.location = data.location ?? user.location;
    user.bio = data.bio ?? user.bio;
    user.avatarUrl = data.avatarUrl ?? user.avatarUrl;
    
    if (data.skills) {
      user.skills = data.skills;
    }

    user.social = data.social ?? user.social;
    user.experiences = data.experiences ?? user.experiences;
    user.education = data.education ?? user.education;

    await repo.save(user);

    const { password, ...userSecure } = user;
    return userSecure;
  }
}