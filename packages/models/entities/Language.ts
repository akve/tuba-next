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
@Unique(['code'])
export class Language {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  is_enabled_frontend: boolean;

  @Column({ nullable: true })
  is_enabled_public: boolean;

  @Column({ type: 'json', nullable: true })
  data: object;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
