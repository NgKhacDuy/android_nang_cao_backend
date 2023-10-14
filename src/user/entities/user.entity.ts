import { Order } from 'src/order/entities/order.entity';
import { Role } from 'src/utilities/common/user-role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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
  @Column({ type: 'enum', enum: Role, default: [Role.USER] })
  roles: Role[];
  @CreateDateColumn()
  createAt: Date;
  @CreateDateColumn()
  updateAt: Date;
  @OneToMany(() => Order, (order) => order.user)
  order: Order[];
}
