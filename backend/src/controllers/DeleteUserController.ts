import { Request, Response } from "express";
import { DeleteUserService } from "../services/DeleteUserService";

export class DeleteUserController {
  async handle(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "A senha é obrigatória para excluir a conta." });
    }

    const service = new DeleteUserService();

    try {
      await service.execute({ userId, password });
      return res.json({ message: "Conta excluída com sucesso." });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}