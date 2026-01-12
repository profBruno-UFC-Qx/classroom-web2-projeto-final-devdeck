import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Project } from "./entities/Project"; 

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Project],
  migrations: [],
  subscribers: [],
});