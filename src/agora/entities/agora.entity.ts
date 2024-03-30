import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Agora {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  channelName: string;
  @Column()
  token: string;
  @Column()
  expireIn: string;
}
