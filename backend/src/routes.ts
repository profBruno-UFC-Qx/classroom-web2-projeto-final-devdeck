import { Router } from "express";
import { authMiddleware } from "./middlewares/authMiddleware";
import { ensureAdmin } from "./middlewares/ensureAdmin";
import { uploadConfig } from "./config/multer";

import { UserController } from "./controllers/UserController";
import { ProjectController } from "./controllers/ProjectController";
import { AuthController } from "./controllers/AuthController";
import { AdminController } from "./controllers/AdminController";
import { UploadController } from "./controllers/UploadController";
import { MessageController } from "./controllers/MessageController";

const routes = Router();

// Inicialização dos controllers
const userController = new UserController();
const projectController = new ProjectController();
const authController = new AuthController();
const adminController = new AdminController();
const uploadController = new UploadController();
const messageController = new MessageController();

// Autenticação e Cadastro
routes.post("/login", authController.handle);
routes.post("/users", userController.create);

// Perfil do Usuário
routes.get("/users", authMiddleware, userController.index);
routes.get("/users/me", authMiddleware, (req, res) => {
  return res.json({ 
    message: "Sessão válida", 
    id: (req as any).userId, 
    role: (req as any).userRole 
  });
});
routes.put("/users/profile", authMiddleware, userController.update);
routes.put("/users/password", authMiddleware, userController.updatePassword);
routes.delete("/users/me", authMiddleware, userController.delete);

// Projetos
routes.post("/projects", authMiddleware, projectController.create);
routes.get("/projects", projectController.index);
routes.put("/projects/:id", authMiddleware, projectController.update);
routes.delete("/projects/:id", authMiddleware, projectController.delete);

// Uploads
routes.post("/uploads", authMiddleware, uploadConfig.single("image"), uploadController.handle);

// Mensagens
routes.post("/messages", authMiddleware, messageController.send);
routes.get("/messages/inbox", authMiddleware, messageController.listMine);

// Portfólio Público
routes.get("/users/:id/portfolio", userController.getPortfolio);

// Administração (Admin Only)
routes.get("/admin/users", authMiddleware, ensureAdmin, adminController.listUsers);
routes.delete("/admin/users/:id", authMiddleware, ensureAdmin, adminController.deleteUser);
routes.patch("/admin/users/:id/role", authMiddleware, ensureAdmin, adminController.updateRole);

routes.get("/admin/projects", authMiddleware, ensureAdmin, adminController.listProjects);
routes.put("/admin/projects/:id", authMiddleware, ensureAdmin, adminController.updateProject);
routes.delete("/admin/projects/:id", authMiddleware, ensureAdmin, adminController.deleteProject);

export { routes };