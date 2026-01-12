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

// --- Rotas de Usuário ---
routes.post("/users", createUserController.handle);
routes.post("/login", authController.handle);

// Exemplo de rota inline tipada
routes.get("/users/me", authMiddleware, (req, res) => {
  return res.json({ 
    message: "Você está logado!", 
    id: (req as any).userId, 
    role: (req as any).userRole 
  });
});

// --- Rota Pública de Perfil ---
routes.get("/users/public/:id", getProfileController.handle);

// --- Rotas de Projetos ---
routes.post("/projects", authMiddleware, createProjectController.handle);
routes.get("/projects", listProjectsController.handle);
routes.delete("/projects/:id", authMiddleware, deleteProjectController.handle);
routes.put("/projects/:id", authMiddleware, updateProjectController.handle);

// --- Uploads & Perfil ---
routes.post("/uploads", authMiddleware, uploadConfig.single("image"), uploadController.handle);
routes.put("/users/profile", authMiddleware, updateProfileController.handle);

export { routes };