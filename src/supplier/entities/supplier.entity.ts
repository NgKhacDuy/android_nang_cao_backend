import { Product } from 'src/product/entities/product.entity';
import { RecipientBill } from 'src/recipient-bill/entities/recipient-bill.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('supplier')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  address: string;
  @OneToMany(() => RecipientBill, (recipient) => recipient.supplier)
  recipientBill: RecipientBill[];
  @OneToMany(() => Product, (product) => product.supplier)
  product: Product[];
  @DeleteDateColumn()
  deletedAt?: Date;
}
