import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";

interface ProjectRequest {
  title: string;
  description: string;
  linkRepo: string;
  linkDeploy: string;
  images: string[];
  tags: string[];
  userId: number;
}

export class CreateProjectService {
  async execute({ 
    title, 
    description, 
    linkRepo, 
    linkDeploy, 
    images, 
    tags, 
    userId 
  }: ProjectRequest) {
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
}