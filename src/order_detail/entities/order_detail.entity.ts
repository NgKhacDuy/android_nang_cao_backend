import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Sale } from 'src/sale/entities/sale.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order_detail')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Order, (order) => order.orderDetail)
  order: Order;
  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;
  @OneToOne(() => Sale)
  @JoinColumn()
  sale: Sale;
  @Column()
  money: string;
}
