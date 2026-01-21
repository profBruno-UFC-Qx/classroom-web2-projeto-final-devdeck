import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Project } from "./Project";
import { Message } from "./Message";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "dev" })
  role!: string;

  @Column({ default: "" }) 
  headline!: string; 

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  bio!: string;

  @Column({ nullable: true })
  avatarUrl!: string;

  @Column("simple-array", { nullable: true })
  skills!: string[];

  @Column("simple-json", { nullable: true })
  social!: { github?: string; linkedin?: string; website?: string };

  @Column("simple-json", { nullable: true })
  experiences!: object[];

  @Column("simple-json", { nullable: true })
  education!: object[];

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects!: Project[];
  
  @OneToMany(() => Message, (message) => message.sender)
  sentMessages!: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages!: Message[];
}