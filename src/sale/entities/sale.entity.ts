import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sale')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  percent: string;
  @Column()
  dateStart: Date;
  @Column()
  dateEnd: Date;
}
