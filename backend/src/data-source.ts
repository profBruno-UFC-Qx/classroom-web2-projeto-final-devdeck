import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Project } from "./entities/Project"; 
import { Message } from "./entities/Message";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Project, Message],
  migrations: [],
  subscribers: [],
});