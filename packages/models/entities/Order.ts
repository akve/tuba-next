import {
  BaseEntity,
  //    BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { CrawlerSite } from './CrawlerSite';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  code: string;

  @Column({ type: 'json' })
  data?: object;

  @Column({ nullable: true })
  total: number;

  @Column({ nullable: true })
  payment_status: string;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;
}
