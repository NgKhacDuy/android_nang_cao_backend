import { type } from 'os';
import { Category } from 'src/category/entities/category.entity';
import { Role } from 'src/utilities/common/user-role.enum';
import {
  Column,
  CreateDateColumn,
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
  @Column()
  name: string;
  @Column()
  size: string;
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
}
