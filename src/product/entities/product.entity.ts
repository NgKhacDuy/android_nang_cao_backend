import { Category } from 'src/category/entities/category.entity';
import { Role } from 'src/utilities/common/user-role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;
  @Column()
  name: string;
  @Column()
  size: string;
  @Column()
  description: string;
  @Column()
  benefit: string;
  @Column()
  img: string;
  @Column()
  money: string;
  @Column()
  quantity: number;
}
