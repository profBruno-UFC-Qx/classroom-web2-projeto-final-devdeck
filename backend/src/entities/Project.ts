import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column("simple-array", { nullable: true })
  images!: string[]; 

  @Column({ nullable: true })
  linkRepo!: string;

  @Column({ nullable: true })
  linkDeploy!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  user_id!: number;

  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: "user_id" })
  user!: User;
}