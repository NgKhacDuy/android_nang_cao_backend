import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nhaRieng: string;
  @Column()
  tinh: string;
  @Column()
  quan: string;
  @Column()
  phuong: string;
  @Column({ default: '' })
  ho: string;
  @Column({ default: '' })
  ten: string;
  @Column()
  sdt: string;
  @Column()
  diaChiNhanHang: string;
  @Column()
  ghiChuDiaChi: string;
  @ManyToOne(() => User, (user) => user.address)
  user: User;
  @Column({ default: true })
  diaChiChinh: boolean;
}
