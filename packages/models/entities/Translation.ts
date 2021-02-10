import {
  //    BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  // ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
// import { CrawlerSite } from './CrawlerSite';

@Entity()
@Unique(['code', 'context'])
export class Translation {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  code: string;

  @Column({ nullable: true })
  context?: string;

  @Column({ nullable: true })
  en: string;

  @Column({ nullable: true })
  translation: string;

  @Column({ type: 'json', nullable: true })
  data: object;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
