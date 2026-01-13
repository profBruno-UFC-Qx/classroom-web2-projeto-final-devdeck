import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

type TokenPayload = {
  id: number;
  role: string;
  iat: number;
  exp: number;
};

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authorization.split(" ");

  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error("Erro de configuração: JWT_SECRET não definido");
    }

    const decoded = verify(token, secret);
    
    const { id, role } = decoded as TokenPayload;

    (req as any).userId = id;
    (req as any).userRole = role;

    return next(); 
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}