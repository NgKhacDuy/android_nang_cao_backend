import { Room } from 'src/chat/entities/room.entity';
import { Friend } from 'src/friend/entities/friend.entity';
import { Message } from 'src/message/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ select: false })
  password: string;
  @Column({ unique: true })
  phoneNumber: string;
  @CreateDateColumn()
  createAt: Date;
  @CreateDateColumn()
  updateAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @Column({ default: '' })
  appId: string;
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
  @ManyToMany(() => Friend, (friend) => friend.user)
  friends: Friend[];
}
