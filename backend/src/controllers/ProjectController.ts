import { Request, Response } from "express";
import { ProjectService } from "../services/ProjectService"; // <--- Importação Única

export class ProjectController {
  
  // Criar Projeto
  async create(req: Request, res: Response) {
    const { title, description, linkRepo, linkDeploy, images, tags } = req.body;
    const userId = (req as any).userId;

    const service = new ProjectService();

    const project = await service.create({
      title,
      description,
      linkRepo,
      linkDeploy,
      images,
      tags, 
      userId
    });

    return res.json(project);
  }

  // Listar Projetos
  async index(req: Request, res: Response) {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const filter = req.query.filter ? String(req.query.filter) : "";
    const userId = req.query.user_id ? Number(req.query.user_id) : undefined;

    const service = new ProjectService();
    const result = await service.list({ page, limit, filter, userId });

    return res.json(result);
  }

  // Atualizar Projeto
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, linkRepo, linkDeploy, images, tags } = req.body;
    
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    const service = new ProjectService();
    const result = await service.update({
      id,
      userId,
      userRole,
      title,
      description,
      linkRepo,
      linkDeploy,
      images,
      tags 
    });

    if (result instanceof Error) {
      if (result.message.includes("permissão")) {
        return res.status(403).json({ error: result.message });
      }
      return res.status(404).json({ error: result.message });
    }

    return res.json(result);
  }

  // Deletar Projeto
  async delete(req: Request, res: Response) {
    const { id } = req.params; 
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const service = new ProjectService();

    // Chama o método .delete()
    const result = await service.delete({ id, userId, userRole });

    if (result instanceof Error) {
      if (result.message.includes("permissão")) {
        return res.status(403).json({ error: result.message });
      }
      return res.status(400).json({ error: result.message });
    }

    return res.status(204).send();
  }
}