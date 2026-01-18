import { AppDataSource } from "../data-source";
import { Message } from "../entities/Message";
import { User } from "../entities/User";

// Tipagem para envio de mensagens
interface SendMessageRequest {
  senderId: number;
  receiverId: number;
  subject: string;
  content: string;
}

export class MessageService {
  
  // Cria e envia uma nova mensagem entre usuários
  async execute({ senderId, receiverId, subject, content }: SendMessageRequest) {
    const messageRepo = AppDataSource.getRepository(Message);
    const userRepo = AppDataSource.getRepository(User);

    // Validação de existência do destinatário
    const receiver = await userRepo.findOneBy({ id: receiverId });
    if (!receiver) {
      throw new Error("Destinatário não encontrado.");
    }

    // Impede envio para o próprio remetente
    if (senderId === receiverId) {
      throw new Error("Você não pode enviar mensagens para si mesmo.");
    }

    // Instancia a mensagem com os relacionamentos
    const message = messageRepo.create({
      subject,
      content,
      sender: { id: senderId },
      receiver: { id: receiverId }
    });

    await messageRepo.save(message);

    return message;
  }

  // Lista o histórico de conversas (recebidas e enviadas)
  async listInbox(userId: number) {
    const messageRepo = AppDataSource.getRepository(Message);
    
    return messageRepo.find({
      // Filtra mensagens onde o usuário é o destinatário OU o remetente
      where: [
        { receiver: { id: userId } },
        { sender: { id: userId } }
      ],
      relations: ["sender", "receiver"], 
      order: { createdAt: "DESC" }
    });
  }
}