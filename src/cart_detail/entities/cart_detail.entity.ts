import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cart_detail')
export class CartDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Cart, (cart) => cart.cartDetail, {
    eager: true,
    onDelete: 'CASCADE',
  })
  cart: Cart;
  @OneToMany(() => Product, (product) => product.cartDetail)
  product: Product[];
  @Column()
  productId: number;
  @Column()
  quantity: number;

  @Column({ default: '' })
  color: string;
}
