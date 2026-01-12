import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const service = new AuthService();

    try {
      const result = await service.execute({ email, password });
      return res.json(result);
    } catch (error) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }
  }
}