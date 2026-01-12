import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { hash } from "bcryptjs";

type UserRequest = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export class CreateUserService {
  async execute({ name, email, password, role }: UserRequest): Promise<User | Error> {
    const repo = AppDataSource.getRepository(User);

    if (await repo.findOne({ where: { email } })) {
      return new Error("E-mail já cadastrado!");
    }

    const passwordHash = await hash(password, 10);

    const user = repo.create({
      name,
      email,
      role, 
      password: passwordHash,
      bio: "",
      location: "",
      avatarUrl: "",
      skills: [],      
      social: {},      
      experiences: [], 
      education: []    
    });

    await repo.save(user);

    return user;
  }
}