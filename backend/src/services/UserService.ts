import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { compare, hash } from "bcryptjs";
import { Brackets } from "typeorm";

// Tipagens de requisição
type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: string;
  headline?: string;
};

type DeleteUserRequest = {
  userId: number;
  password: string;
};

type UpdatePasswordRequest = {
  userId: number;
  currentPassword: string;
  newPassword: string;
};

type UpdateProfileRequest = {
  userId: number;
  name?: string;
  headline?: string; 
  location?: string;
  bio?: string;
  avatarUrl?: string;
  skills?: string[];
  social?: any;
  experiences?: any[];
  education?: any[];
};

export class UserService {

  // Criação de novo usuário
  async create({ name, email, password, role, headline }: CreateUserRequest): Promise<User | Error> {
    const repo = AppDataSource.getRepository(User);

    if (await repo.findOne({ where: { email } })) {
      return new Error("E-mail já cadastrado!");
    }

    const passwordHash = await hash(password, 10);
    
    let userRole = "dev";
    if (role === "recruiter") {
      userRole = "recruiter";
    }

    const user = repo.create({
      name,
      email,
      role: userRole, 
      headline: headline || "", 
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

  // Remoção de conta com validação de senha
  async delete({ userId, password }: DeleteUserRequest) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id: userId });

    if (!user) throw new Error("Usuário não encontrado.");

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new Error("Senha incorreta.");
    
    await repo.delete(userId);
    return true;
  }

  // Busca perfil completo para área logada
  async getProfile(userId: number) {
    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({
      where: { id: userId },
      relations: ["projects"],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,     
        headline: true, 
        location: true, 
        bio: true,      
        avatarUrl: true,
        skills: true,   
        social: true,   
        experiences: true, 
        education: true    
      }
    });

    if (!user) return new Error("Usuário não encontrado");
    return user;
  }

  // Busca dados públicos para visitantes
  async getPublicPortfolio(id: number) {
    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({
      where: { id: id },
      relations: ["projects"], 
      select: {
        id: true,
        name: true,
        role: true,
        headline: true, 
        location: true,
        bio: true,
        avatarUrl: true,
        skills: true,
        social: true,
        experiences: true,
        education: true,
      }
    });

    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }

  // Atualização de senha
  async updatePassword({ userId, currentPassword, newPassword }: UpdatePasswordRequest) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id: userId });

    if (!user) throw new Error("Usuário não encontrado.");

    const passwordMatch = await compare(currentPassword, user.password);
    if (!passwordMatch) throw new Error("A senha atual está incorreta.");

    const passwordHash = await hash(newPassword, 8);
    user.password = passwordHash;
    
    await repo.save(user);
    return { message: "Senha atualizada com sucesso." };
  }

  // Atualização de dados cadastrais e profissionais
  async updateProfile(data: UpdateProfileRequest) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id: data.userId });

    if (!user) return new Error("Usuário não encontrado");

    user.name = data.name ?? user.name;
    user.headline = data.headline ?? user.headline; 
    user.location = data.location ?? user.location;
    user.bio = data.bio ?? user.bio;
    user.avatarUrl = data.avatarUrl ?? user.avatarUrl;
    
    if (data.skills) user.skills = data.skills;
    
    user.social = data.social ?? user.social;
    user.experiences = data.experiences ?? user.experiences;
    user.education = data.education ?? user.education;

    await repo.save(user);

    const { password, ...userSecure } = user;
    return userSecure;
  }

  // Listagem paginada de talentos com filtros
  async findAllDevelopers(query: string = "", page: number = 1, limit: number = 9) {
    const repo = AppDataSource.getRepository(User);
    const qb = repo.createQueryBuilder("user");

    qb.where("user.role = :role", { role: "dev" });

    if (query) {
      const searchTerm = `%${query}%`;
      qb.andWhere(
        new Brackets((qb) => {
          qb.where("user.name LIKE :q", { q: searchTerm })
            .orWhere("user.headline LIKE :q", { q: searchTerm })
            .orWhere("user.location LIKE :q", { q: searchTerm })
            .orWhere("user.skills LIKE :q", { q: searchTerm });
        })
      );
    }

    qb.select([
      "user.id", "user.name", "user.headline", 
      "user.avatarUrl", "user.skills", "user.location"
    ]);

    const skip = (page - 1) * limit;
    
    qb.orderBy("user.createdAt", "DESC");
    qb.skip(skip);
    qb.take(limit);

    const [users, total] = await qb.getManyAndCount();

    return {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit)
    };
  }
}