import { Request, Response } from "express";
import { UpdateProfileService } from "../services/UpdateProfileService";

export class UpdateProfileController {
  async handle(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { 
      name, role, location, bio, avatarUrl, 
      skills, social, experiences, education 
    } = req.body;

    const service = new UpdateProfileService();

    const result = await service.execute({
      userId,
      name, role, location, bio, avatarUrl,
      skills, social, experiences, education
    });

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    return res.json(result);
  }
}