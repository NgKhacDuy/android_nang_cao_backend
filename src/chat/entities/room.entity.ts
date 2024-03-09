import { UUID } from 'crypto';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: uuidv4() })
  name: string;

  @Column('text', { array: true })
  listUsers: UUID[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];

  @Column({ default: false })
  isGroup: boolean;
}
