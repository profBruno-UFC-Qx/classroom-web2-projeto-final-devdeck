import { Request, Response } from "express";
import { UserService } from "../services/UserService"; 

export class UserController {
  
  // Criar Usuário
  async create(req: Request, res: Response) {
    const { name, email, password, role, headline } = req.body;

    const service = new UserService();

    const result = await service.create({ 
      name, 
      email, 
      password, 
      role,
      headline 
    });

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    return res.status(201).json(result);
  }

  async delete(req: Request, res: Response) { 
      const userId = (req as any).userId;
      const { password } = req.body;
      if (!password) return res.status(400).json({ error: "A senha é obrigatória para excluir a conta." });
      const service = new UserService();
      try {
        await service.delete({ userId, password });
        return res.json({ message: "Conta excluída com sucesso." });
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }
  }

  async showProfile(req: Request, res: Response) { 
      const { id } = req.params; 
      const service = new UserService();
      const result = await service.getProfile(Number(id));
      if (result instanceof Error) return res.status(404).json({ error: result.message });
      return res.json(result);
  }

  async getPortfolio(req: Request, res: Response) { 
      const { id } = req.params;
      const service = new UserService();
      try {
        const result = await service.getPublicPortfolio(Number(id));
        return res.json(result);
      } catch (error) {
        return res.status(404).json({ error: "Portfólio não encontrado" });
      }
  }
  
  async updatePassword(req: Request, res: Response) { 
      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).userId;
      const service = new UserService();
      try {
        const result = await service.updatePassword({ userId, currentPassword, newPassword });
        return res.json(result);
      } catch (error: any) {
        const status = error.message === "A senha atual está incorreta." ? 401 : 400;
        return res.status(status).json({ error: error.message });
      }
   }

  // Atualizar Perfil Próprio
  async update(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { 
      name, headline, location, bio, avatarUrl, 
      skills, social, experiences, education 
    } = req.body;

    const service = new UserService();

    const result = await service.updateProfile({
      userId,
      name, 
      headline, 
      location, 
      bio, 
      avatarUrl,
      skills, 
      social, 
      experiences, 
      education
    });

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    return res.json(result);
  }

  // Listar Todos os Desenvolvedores (com busca e paginação)
  async index(req: Request, res: Response) {
    const q = (req.query.q as string) || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;

    const service = new UserService();
    
    try {
      const result = await service.findAllDevelopers(q, page, limit);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro ao buscar talentos." });
    }
  }
}