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

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { array: true })
  listUsers: UUID[];

  @OneToMany(() => Message, (message) => message.room, { eager: true })
  messages: Message[];

  @Column({ default: false })
  isGroup: boolean;
}
