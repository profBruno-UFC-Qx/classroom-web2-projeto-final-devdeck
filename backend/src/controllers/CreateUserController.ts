import { Request, Response } from "express";
import { CreateUserService } from "../services/CreateUserService";

export class CreateUserController {
  async handle(req: Request, res: Response) {
    // Recebe os dados do corpo da requisição (JSON)
    const { name, email, password, role } = req.body;

    // Chama o serviço
    const service = new CreateUserService();
    const result = await service.execute({ name, email, password, role });

    // Se o serviço retornou erro, devolve erro 400 (Bad Request)
    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    // Se deu certo, devolve o usuário criado com status 201 (Created)
    return res.status(201).json(result);
  }
}