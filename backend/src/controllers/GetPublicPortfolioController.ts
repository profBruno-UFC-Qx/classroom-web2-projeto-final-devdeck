import { Request, Response } from "express";
import { GetPublicPortfolioService } from "../services/GetPublicPortfolioService";

export class GetPublicPortfolioController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const service = new GetPublicPortfolioService();

    try {
      // Convertemos o ID para número, pois no banco é number
      const result = await service.execute(Number(id));
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error: "Portfólio não encontrado" });
    }
  }
}