import { Role } from 'src/utilities/common/user-role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column({ select: false })
  password: string;
  @Column({ unique: true })
  email: string;
  @Column()
  name: string;
  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];
  @CreateDateColumn()
  createAt: Date;
  @CreateDateColumn()
  updateAt: Date;
  @Column({ default: 0 })
  isDeleted: boolean;
}
