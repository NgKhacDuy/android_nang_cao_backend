import { UUID } from 'crypto';
import { Room } from 'src/chat/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderId: UUID;

  @Column()
  content: string;

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;

  @Column('text', { array: true })
  readBy: [];

  @CreateDateColumn()
  createAt: Date;
}
