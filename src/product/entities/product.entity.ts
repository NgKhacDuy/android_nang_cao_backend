import { type } from 'os';
import { CartDetail } from 'src/cart_detail/entities/cart_detail.entity';
import { Category } from 'src/category/entities/category.entity';
import { OrderDetail } from 'src/order_detail/entities/order_detail.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Role } from 'src/utilities/common/user-role.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Category, (category) => category.product, { eager: true })
  category: Category;
  @ManyToOne(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetail: OrderDetail;
  @ManyToOne(() => CartDetail, (cartDetail) => cartDetail.product, {
    eager: true,
    onDelete: 'SET NULL',
  })
  cartDetail: CartDetail;
  @Column()
  name: string;
  @Column({ type: 'json', default: [] })
  color: string[];
  @Column()
  description: string;
  @Column()
  benefit: string;
  @Column({ type: 'json' })
  img: string[];
  @Column()
  money: string;
  @Column()
  quantity: number;
  @Column({ default: true })
  isShow: boolean;
  @Column({ default: '' })
  slug: string;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => Supplier, (supplier) => supplier.product)
  supplier: Supplier;
}
