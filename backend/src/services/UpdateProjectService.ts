import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";

type UpdateRequest = {
  id: string;
  userId: number;
  userRole: string;
  title?: string;
  description?: string;
  linkRepo?: string;
  linkDeploy?: string;
  images?: string[]; 
};

export class UpdateProjectService {
  async execute({ id, userId, userRole, title, description, linkRepo, linkDeploy, images }: UpdateRequest) {
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
    
    // Atualiza a lista de imagens se vier nova
    project.images = images ?? project.images;

    await repo.save(project);
    return project;
  }
}