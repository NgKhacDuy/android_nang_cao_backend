import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  idSender: string;
  @Column()
  idReceiver: string;
  @Column()
  content: string;
  @CreateDateColumn()
  timeSend: Date;
  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;
}

