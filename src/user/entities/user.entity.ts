import { Address } from 'src/address/entities/address.entity';
import { Order } from 'src/order/entities/order.entity';
import { GENDER } from 'src/utilities/common/user-gender.enum';
import { Role } from 'src/utilities/common/user-role.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
  @Column({ type: 'enum', enum: GENDER, default: GENDER.male })
  gender: GENDER;
  @Column({ default: '' })
  lastName: string;
  @Column({ default: '' })
  firstName: string;
  @Column({ type: 'enum', enum: Role, default: [Role.USER] })
  roles: Role;
  @CreateDateColumn()
  createAt: Date;
  @CreateDateColumn()
  updateAt: Date;
  @OneToMany(() => Order, (order) => order.user)
  order: Order[];
  @OneToMany(() => Address, (address) => address.user)
  address: Address[];
  @Column({ default: '' })
  phoneNumber: string;
  @DeleteDateColumn()
  deletedAt?: Date;
}
