import { CartDetail } from 'src/cart_detail/entities/cart_detail.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @Column()
  userId: number;
  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.cart)
  cartDetail: CartDetail[];
  @Column()
  totalMoney: string;
}
