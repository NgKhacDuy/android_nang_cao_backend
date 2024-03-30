import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('agora')
export class Agora {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  channelName: string;
  @Column()
  token: string;
  @Column()
  expireIn: string;
  @CreateDateColumn()
  createdAt: Date;
}
