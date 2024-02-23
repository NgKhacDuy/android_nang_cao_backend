import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  user1: string;
  @Column()
  user2: string;
  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
