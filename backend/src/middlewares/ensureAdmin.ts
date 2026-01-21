import { Request, Response, NextFunction } from "express";

export function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  const { userRole } = (req as any);

  if (userRole === "admin") {
    return next(); // Pode passar
  }

  // Se não for admin, bloqueia 
  return res.status(403).json({ error: "Acesso negado. Requer privilégios de administrador." });
}