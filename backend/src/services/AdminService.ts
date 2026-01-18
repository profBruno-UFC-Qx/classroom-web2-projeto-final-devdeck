import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Project } from "../entities/Project";
import { Like } from "typeorm";

export class AdminService {
  
  // --- USUÁRIOS (Com Paginação e Busca) ---
  async listAllUsers(page: number, limit: number, search: string) {
    const repo = AppDataSource.getRepository(User);
    
    const skip = (page - 1) * limit;

    const whereCondition = search 
      ? [
          { name: Like(`%${search}%`) },
          { email: Like(`%${search}%`) }
        ]
      : {};

    const [users, total] = await repo.findAndCount({
      select: ["id", "name", "email", "role", "createdAt", "avatarUrl"], 
      where: whereCondition,
      order: { createdAt: "DESC" },
      take: limit, 
      skip: skip   
    });

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  async deleteUser(id: number) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id });
    if (!user) return new Error("Usuário não encontrado");
    await repo.remove(user);
    return true;
  }

  async updateUserRole(id: number, newRole: string) {
    const repo = AppDataSource.getRepository(User);
    if (!['admin', 'dev'].includes(newRole)) return new Error("Cargo inválido.");
    const user = await repo.findOneBy({ id });
    if (!user) return new Error("Usuário não encontrado");
    user.role = newRole;
    await repo.save(user);
    return user;
  }

  // --- PROJETOS (Com Paginação e Busca) ---

  async listAllProjects(page: number, limit: number, search: string) {
    const repo = AppDataSource.getRepository(Project);
    
    const skip = (page - 1) * limit;

    const whereCondition = search 
      ? { title: Like(`%${search}%`) }
      : {};

    const [projects, total] = await repo.findAndCount({
      relations: ["user"],
      where: whereCondition,
      order: { createdAt: "DESC" },
      take: limit,
      skip: skip
    });

    return {
      projects,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  async deleteProject(id: number) {
    const repo = AppDataSource.getRepository(Project);
    const project = await repo.findOneBy({ id });
    if (!project) return new Error("Projeto não encontrado");
    await repo.remove(project);
    return true;
  }

  async updateProject(
    id: number, 
    title: string, 
    description: string, 
    tags: string[], 
    linkRepo: string, 
    linkDeploy: string, 
    images: string[]
  ) {
    const repo = AppDataSource.getRepository(Project);
    const project = await repo.findOneBy({ id });

    if (!project) return new Error("Projeto não encontrado");

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (tags !== undefined) project.tags = tags;
    if (linkRepo !== undefined) project.linkRepo = linkRepo;
    if (linkDeploy !== undefined) project.linkDeploy = linkDeploy;
    if (images !== undefined) project.images = images;

    await repo.save(project);
    return project;
  }
}