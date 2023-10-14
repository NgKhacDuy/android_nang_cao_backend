import { Product } from 'src/product/entities/product.entity';
import { RecipientBill } from 'src/recipient-bill/entities/recipient-bill.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recipient_detail')
export class RecipientDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => RecipientBill, (bill) => bill.recipientDetail)
  recipientId: RecipientBill;
  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;
  @Column()
  money: string;
}
