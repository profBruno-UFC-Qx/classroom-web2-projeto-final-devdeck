import { Request, Response } from "express";

export class UploadController {
  async handle(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.json({
      url: fullUrl,
      filename: req.file.filename
    });
  }
}