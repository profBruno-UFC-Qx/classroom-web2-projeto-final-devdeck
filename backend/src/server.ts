import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./data-source";
import { routes } from "./routes";

// Importações necessárias para o Seed
import { User } from "./entities/User";
import { hash } from "bcryptjs";

// --- Função de Seed (Cria Admin se não existir) ---
async function createDefaultAdmin() {
  const repo = AppDataSource.getRepository(User);
  
  // Verifica se JÁ existe algum admin no sistema
  const adminExists = await repo.findOneBy({ role: "admin" });

  if (!adminExists) {
    console.log("Nenhum admin encontrado. Criando Super Admin...");
    
    const passwordHash = await hash("admin123", 10); 

    const admin = repo.create({
      name: "Super Admin",
      email: "admin@devdeck.com", 
      password: passwordHash,
      role: "admin", 
      bio: "Administrador do Sistema",
      location: "Server",
      avatarUrl: "", 
      skills: ["System", "Management"],
      social: {},
      experiences: [],
      education: []
    });

    await repo.save(admin);
    console.log("Super Admin criado com sucesso!");
    console.log("Email: admin@devdeck.com");
    console.log("Senha: admin123");
  } else {
    console.log("Sistema já possui administrador.");
  }
}

AppDataSource.initialize().then(async () => {
  await createDefaultAdmin();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

  app.use(routes);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

});