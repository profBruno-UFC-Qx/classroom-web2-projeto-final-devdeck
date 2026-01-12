import { Request, Response } from "express";
import { UpdateProjectService } from "../services/UpdateProjectService";

export class UpdateProjectController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, linkRepo, linkDeploy, images } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    const service = new UpdateProjectService();
    const result = await service.execute({
      id,
      userId,
      userRole,
      title,
      description,
      linkRepo,
      linkDeploy,
      images 
    });

    if (result instanceof Error) {
      if (result.message.includes("permissão")) {
        return res.status(403).json({ error: result.message });
      }
      return res.status(404).json({ error: result.message });
    }

    return res.json(result);
  }
}