import { OrderDetail } from 'src/order_detail/entities/order_detail.entity';
import { User } from 'src/user/entities/user.entity';
import { StatusOrder } from 'src/utilities/common/status-order.enum';
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
  @Column({
    type: 'enum',
    enum: StatusOrder,
    default: StatusOrder.WAITING_FOR_ACCEPT,
  })
  status: StatusOrder;
}
