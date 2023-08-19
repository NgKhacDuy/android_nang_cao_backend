import { Role } from 'src/utilities/user-role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  name: string;
  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];
}
