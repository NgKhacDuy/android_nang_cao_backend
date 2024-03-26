import { Room } from 'src/chat/entities/room.entity';
import { Friend } from 'src/friend/entities/friend.entity';
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
  @OneToMany(() => Friend, (friend) => friend.user, { eager: true })
  friends: Friend[];
  @Column({ default: '' })
  appId: string;
}
