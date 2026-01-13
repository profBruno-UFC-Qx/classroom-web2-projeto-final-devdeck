import { Request, Response } from "express";
import { DeleteProjectService } from "../services/DeleteProjectService";

export class DeleteProjectController {
  async handle(req: Request, res: Response) {
    const { id } = req.params; 
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const service = new DeleteProjectService();

    const result = await service.execute({ id, userId, userRole });

    if (result instanceof Error) {
      // Se for erro de permissão, retorna 403 (Forbidden)
      if (result.message.includes("permissão")) {
        return res.status(403).json({ error: result.message });
      }
      return res.status(400).json({ error: result.message });
    }

    return res.status(204).send();
  }
}