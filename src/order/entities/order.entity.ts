import { OrderDetail } from 'src/order_detail/entities/order_detail.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.order)
  user: User;
  @OneToMany(() => OrderDetail, (detail) => detail.order)
  orderDetail: OrderDetail[];
  @Column()
  dateCreate: Date;
  @Column()
  totalMoney: string;
}