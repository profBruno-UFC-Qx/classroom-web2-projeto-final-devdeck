import { Request, Response } from "express";
import { ListProjectsService } from "../services/ListProjectsService";

export class ListProjectsController {
  async handle(req: Request, res: Response) {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const filter = req.query.filter ? String(req.query.filter) : "";
    const userId = req.query.user_id ? Number(req.query.user_id) : undefined;
    const service = new ListProjectsService();
    const result = await service.execute({ page, limit, filter, userId });

    return res.json(result);
  }
}