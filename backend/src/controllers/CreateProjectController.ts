import { Request, Response } from "express";
import { CreateProjectService } from "../services/CreateProjectService";

export class CreateProjectController {
  async handle(req: Request, res: Response) {
    const { title, description, linkRepo, linkDeploy, images } = req.body;
    const userId = (req as any).userId;
    const service = new CreateProjectService();
    const project = await service.execute({
      title,
      description,
      linkRepo,
      linkDeploy,
      images, 
      userId
    });

    return res.json(project);
  }
}