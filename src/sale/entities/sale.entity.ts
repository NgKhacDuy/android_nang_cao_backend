import { Column, Double, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sale')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: 'double precision' })
  percent: number;
  @Column()
  dateStart: Date;
  @Column()
  dateEnd: Date;
}
