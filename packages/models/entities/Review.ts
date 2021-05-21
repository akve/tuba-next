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
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ nullable: true })
  product: number;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: true })
  userlink: string;

  @Column({ nullable: true })
  reviewlink: string;

  @Column({ nullable: true })
  score_date: Date;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ type: 'json' })
  data?: object;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;
}
