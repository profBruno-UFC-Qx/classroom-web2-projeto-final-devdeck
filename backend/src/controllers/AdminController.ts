import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";

export class AdminController {

  async listUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const service = new AdminService();
    const result = await service.listAllUsers(page, limit, search);
    return res.json(result);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const service = new AdminService();
    const result = await service.deleteUser(Number(id));
    if (result instanceof Error) return res.status(400).json({ error: result.message });
    return res.status(204).send();
  }

  async updateRole(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;
    const service = new AdminService();
    const result = await service.updateUserRole(Number(id), role);
    if (result instanceof Error) return res.status(400).json({ error: result.message });
    return res.json(result);
  }

  // ... Métodos de Projeto ...

  async listProjects(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const service = new AdminService();
    const result = await service.listAllProjects(page, limit, search);
    return res.json(result);
  }

  async deleteProject(req: Request, res: Response) {
    const { id } = req.params;
    const service = new AdminService();
    const result = await service.deleteProject(Number(id));
    if (result instanceof Error) return res.status(400).json({ error: result.message });
    return res.status(204).send();
  }

  async updateProject(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, tags, linkRepo, linkDeploy, images } = req.body;

    const service = new AdminService();
    const result = await service.updateProject(
      Number(id), 
      title, 
      description, 
      tags, 
      linkRepo, 
      linkDeploy, 
      images
    );

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    return res.json(result);
  }
}