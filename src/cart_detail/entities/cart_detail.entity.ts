import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cart_detail')
export class CartDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Cart, (cart) => cart.cartDetail)
  cart: Cart;
  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;
  @Column()
  productId: number;
  @Column()
  quantity: number;
  @Column()
  money: string;
}
