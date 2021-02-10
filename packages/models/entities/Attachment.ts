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
export class Attachment extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  filename: string;

  @Column()
  filetype: string;

  @Column()
  location?: string;

  @Column({ nullable: true })
  to_model: string;

  @Column({ nullable: true })
  to_id?: number;

  @Column({ type: 'json' })
  data?: object;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;
}
