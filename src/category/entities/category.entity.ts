import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
  @Column({ default: false })
  isHidden: boolean;
  @Column({ default: '' })
  title: string;
  @Column({ default: '' })
  subTitle: string;
}
