import { Message } from 'src/message/entities/message.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  url: string;
  @ManyToOne(() => Message, (message) => message.images, { cascade: true })
  message: Message;
}
