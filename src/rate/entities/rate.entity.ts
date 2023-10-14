import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rate')
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  comment: string;
  @Column()
  rate: number;
  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
