import { Request, Response } from "express";
import { MessageService } from "../services/MessageService";

export class MessageController {
  
  async send(req: Request, res: Response) {
    const { receiverId, subject, content } = req.body;
    const senderId = (req as any).userId; // Pega do Token JWT

    const service = new MessageService();

    try {
      const message = await service.execute({
        senderId,
        receiverId,
        subject,
        content
      });
      return res.status(201).json(message);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listMine(req: Request, res: Response) {
    const userId = (req as any).userId;
    const service = new MessageService();
    const messages = await service.listInbox(userId);
    return res.json(messages);
  }
}