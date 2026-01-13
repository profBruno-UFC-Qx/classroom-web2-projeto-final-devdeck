import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";
import { Like } from "typeorm";

type ListRequest = {
  page?: number;
  limit?: number;
  filter?: string;
  userId?: number;
};

export class ListProjectsService {
  async execute({ page = 1, limit = 10, filter = "", userId }: ListRequest) {
    const repo = AppDataSource.getRepository(Project);

    const skip = (page - 1) * limit;

    // Construção dinâmica do filtro 
    const whereCondition: any = {};
    
    // Se tiver texto de busca, adiciona
    if (filter) {
      whereCondition.title = Like(`%${filter}%`);
    }

    // Se tiver ID de usuário, adiciona 
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
}