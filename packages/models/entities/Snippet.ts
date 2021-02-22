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
export class Snippet extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  code: string;

  @Column({ type: 'text', nullable: true })
  content_ru: string;

  @Column({ type: 'text', nullable: true })
  content_ua: string;

  @Column({ type: 'text', nullable: true })
  content_en: string;

  @Column({ type: 'json' })
  data?: object;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;
}
