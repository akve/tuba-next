import {
  //    BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FilterPreset {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  user_id: number;

  @Column()
  name: string;

  @Column()
  table_key: string;

  @Column({ type: 'json', default: '{}' })
  data: object;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
