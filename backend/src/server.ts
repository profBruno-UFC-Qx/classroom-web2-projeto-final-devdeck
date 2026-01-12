import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./data-source";
import { routes } from "./routes";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Configuração de arquivos estáticos
  app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

  app.use(routes);

  app.listen(3000, () => console.log("Server is running on port 3000"));
});