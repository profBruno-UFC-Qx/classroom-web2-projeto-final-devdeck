import { Request, Response } from "express";
import { GetProfileService } from "../services/GetProfileService";

export class GetProfileController {
  async handle(req: Request, res: Response) {
    const { id } = req.params; 

    const service = new GetProfileService();
    const result = await service.execute(Number(id));

    if (result instanceof Error) {
      return res.status(404).json({ error: result.message });
    }

    return res.json(result);
  }
}