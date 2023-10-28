import { RecipientDetail } from 'src/recipient-detail/entities/recipient-detail.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recipient_bill')
export class RecipientBill {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Supplier, (supplier) => supplier.recipientBill)
  supplier: Supplier;
  @Column()
  dateImport: Date;
  @Column()
  totalMoney: string;
  @OneToMany(
    () => RecipientDetail,
    (recipientDetail) => recipientDetail.recipient,
  )
  recipientDetail: RecipientDetail[];
}
