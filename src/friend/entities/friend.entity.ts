import { User } from 'src/user/entities/user.entity';
import { FriendStatus } from 'src/utilities/common/friend-status.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('friend')
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ default: '' })
  idSender: string;
  @Column({ default: '' })
  idReceiver: string;
  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  user: User[];
  @Column({
    type: 'enum',
    enum: FriendStatus,
    default: FriendStatus.WAITING_FOR_ACCEPT,
  })
  status: FriendStatus;
}
