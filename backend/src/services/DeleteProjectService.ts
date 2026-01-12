import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";

type DeleteRequest = {
  id: string;      // ID do projeto a ser deletado
  userId: number;  // ID de quem está tentando deletar
  userRole: string;// Papel de quem está tentando (admin ou dev)
};

export class DeleteProjectService {
  async execute({ id, userId, userRole }: DeleteRequest) {
    const repo = AppDataSource.getRepository(Project);

    // Busca o projeto no banco
    const project = await repo.findOne({ where: { id: Number(id) } });

    if (!project) {
      return new Error("Projeto não encontrado!");
    }

    // LÓGICA DE PERMISSÃO 
    // Se o usuário NÃO for admin E NÃO for o dono do projeto...
    if (userRole !== "admin" && project.user_id !== userId) {
      return new Error("Você não tem permissão para deletar este projeto!");
    }

    // Se passou, deleta
    await repo.remove(project);
  }
}