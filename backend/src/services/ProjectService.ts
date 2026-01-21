import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";
import { Like } from "typeorm";

// Tipagens para as requisições
interface CreateProjectRequest {
  title: string;
  description: string;
  linkRepo: string;
  linkDeploy: string;
  images: string[];
  tags: string[];
  userId: number;
}

type DeleteProjectRequest = {
  id: string;
  userId: number;
  userRole: string;
};

type ListProjectRequest = {
  page?: number;
  limit?: number;
  filter?: string;
  userId?: number;
};

type UpdateProjectRequest = {
  id: string;
  userId: number;
  userRole: string;
  title?: string;
  description?: string;
  linkRepo?: string;
  linkDeploy?: string;
  images?: string[];
  tags?: string[];
};

export class ProjectService {

  // Cadastro de novo projeto vinculado ao usuário
  async create({ 
    title, 
    description, 
    linkRepo, 
    linkDeploy, 
    images, 
    tags, 
    userId 
  }: CreateProjectRequest) {
    const repo = AppDataSource.getRepository(Project);

    const project = repo.create({
      title,
      description,
      linkRepo,
      linkDeploy,
      images,
      tags: tags || [], 
      user_id: userId
    });

    await repo.save(project);
    return project;
  }

  // Exclusão com verificação de posse ou privilégio admin
  async delete({ id, userId, userRole }: DeleteProjectRequest) {
    const repo = AppDataSource.getRepository(Project);

    const project = await repo.findOne({ where: { id: Number(id) } });

    if (!project) {
      return new Error("Projeto não encontrado!");
    }

    if (userRole !== "admin" && project.user_id !== userId) {
      return new Error("Você não tem permissão para deletar este projeto!");
    }

    await repo.remove(project);
  }

  // Listagem paginada com suporte a filtros de título e usuário
  async list({ page = 1, limit = 10, filter = "", userId }: ListProjectRequest) {
    const repo = AppDataSource.getRepository(Project);

    const skip = (page - 1) * limit;

    const whereCondition: any = {};
    
    if (filter) {
      whereCondition.title = Like(`%${filter}%`);
    }

    if (userId) {
      whereCondition.user_id = userId;
    }

    const [projects, total] = await repo.findAndCount({
      where: whereCondition,
      take: limit,
      skip: skip,
      relations: ["user"],
      order: { createdAt: "DESC" }, 
      select: {
        user: {
          id: true,
          name: true,
          email: true
        }
      }
    });

    return {
      data: projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Edição de campos permitidos com validação de segurança
  async update({ 
    id, 
    userId, 
    userRole, 
    title, 
    description, 
    linkRepo, 
    linkDeploy, 
    images, 
    tags 
  }: UpdateProjectRequest) {
    const repo = AppDataSource.getRepository(Project);
    const project = await repo.findOne({ where: { id: Number(id) } });

    if (!project) return new Error("Projeto não encontrado!");

    if (userRole !== "admin" && project.user_id !== userId) {
      return new Error("Sem permissão!");
    }

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.linkRepo = linkRepo ?? project.linkRepo;
    project.linkDeploy = linkDeploy ?? project.linkDeploy;
    project.images = images ?? project.images;
    project.tags = tags ?? project.tags; 

    await repo.save(project);
    return project;
  }
}