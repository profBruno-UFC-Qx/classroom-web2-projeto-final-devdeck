import { Request, Response } from "express";
import { UpdatePasswordService } from "../services/UpdatePasswordService";

export class UpdatePasswordController {
  async handle(req: Request, res: Response) {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).userId;

    const service = new UpdatePasswordService();

    try {
      const result = await service.execute({
        userId,
        currentPassword,
        newPassword
      });

      return res.json(result);
    } catch (error: any) {
      const status = error.message === "A senha atual está incorreta." ? 401 : 400;
      return res.status(status).json({ error: error.message });
    }
  }
}