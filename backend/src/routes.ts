import { Router } from "express";
import { authMiddleware } from "./middlewares/authMiddleware";
import { uploadConfig } from "./config/multer";

// Controllers 
import { CreateUserController } from "./controllers/CreateUserController";
import { AuthController } from "./controllers/AuthController";
import { CreateProjectController } from "./controllers/CreateProjectController";
import { ListProjectsController } from "./controllers/ListProjectsController";
import { DeleteProjectController } from "./controllers/DeleteProjectController";
import { UpdateProjectController } from "./controllers/UpdateProjectController";
import { GetProfileController } from "./controllers/GetProfileController";
import { UploadController } from "./controllers/UploadController";
import { UpdateProfileController } from "./controllers/UpdateProfileController";
import { DeleteUserController } from "./controllers/DeleteUserController";
import { UpdatePasswordController } from "./controllers/UpdatePasswordController";
// --- NOVO CONTROLLER ---
import { GetPublicPortfolioController } from "./controllers/GetPublicPortfolioController";

const routes = Router();

// --- Instâncias ---
const createUserController = new CreateUserController();
const authController = new AuthController();
const createProjectController = new CreateProjectController();
const listProjectsController = new ListProjectsController();
const deleteProjectController = new DeleteProjectController();
const updateProjectController = new UpdateProjectController();
const getProfileController = new GetProfileController();
const uploadController = new UploadController(); 
const updateProfileController = new UpdateProfileController();
const deleteUserController = new DeleteUserController();
const updatePasswordController = new UpdatePasswordController();
// --- NOVA INSTÂNCIA ---
const getPublicPortfolioController = new GetPublicPortfolioController();

// --- Rotas de Usuário ---
routes.post("/users", createUserController.handle);
routes.post("/login", authController.handle);

// Rotas de Gestão de Conta 
routes.delete("/users/me", authMiddleware, deleteUserController.handle);
routes.put("/users/password", authMiddleware, updatePasswordController.handle);

// Rota de verificação de token 
routes.get("/users/me", authMiddleware, (req, res) => {
  return res.json({ 
    message: "Você está logado!", 
    id: (req as any).userId, 
    role: (req as any).userRole 
  });
});
// --- ROTA PÚBLICA ---
routes.get("/users/:id/portfolio", getPublicPortfolioController.handle);

// --- Rotas de Projetos ---
routes.post("/projects", authMiddleware, createProjectController.handle);
routes.get("/projects", listProjectsController.handle);
routes.delete("/projects/:id", authMiddleware, deleteProjectController.handle);
routes.put("/projects/:id", authMiddleware, updateProjectController.handle);

// --- Uploads & Perfil ---
routes.post("/uploads", authMiddleware, uploadConfig.single("image"), uploadController.handle);
routes.put("/users/profile", authMiddleware, updateProfileController.handle);

export { routes };