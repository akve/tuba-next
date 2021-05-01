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
export class ProductSort extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  product: number;

  @Column({ nullable: true })
  category: number;

  @Column({ nullable: true })
  collection: number;

  @Column({ nullable: true, type: 'float' })
  sort: number;
}
