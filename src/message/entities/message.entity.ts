import { UUID } from 'crypto';
import { Room } from 'src/chat/entities/room.entity';
import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import { MessageType } from 'src/utilities/common/message-type_dto.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderId: UUID;

  @Column({ default: '' })
  content: string;

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;

  @Column('text', { array: true })
  readBy: [];

  @CreateDateColumn()
  createAt: Date;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.raw })
  type: MessageType;

  @OneToMany(() => Image, (image) => image.message)
  images: Image[];

  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  user: User;
}
