import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";

interface ProjectRequest {
  title: string;
  description: string;
  linkRepo: string;
  linkDeploy: string;
  images: string[]; 
  userId: number;
}

export class CreateProjectService {
  async execute({ title, description, linkRepo, linkDeploy, images, userId }: ProjectRequest) {
    const repo = AppDataSource.getRepository(Project);

    const project = repo.create({
      title,
      description,
      linkRepo,
      linkDeploy,
      images, 
      user_id: userId
    });

    await repo.save(project);
    return project;
  }
}