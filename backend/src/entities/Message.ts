import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("messages")
export class Message {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  subject!: string; 

  @Column("text")
  content!: string; 

  @Column()
  senderId!: number; 

  @ManyToOne(() => User, user => user.sentMessages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "senderId" })
  sender!: User; 

  @Column()
  receiverId!: number; 

  @ManyToOne(() => User, user => user.receivedMessages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "receiverId" })
  receiver!: User; 

  @CreateDateColumn()
  createdAt!: Date; 
}