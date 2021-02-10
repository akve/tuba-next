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
export class Log extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id?: number;

    @Column({nullable: true})
    action: string;

    @Column({nullable: true})
    area: string;

    @Column({nullable: true})
    from_user_id: number;

    @Column({ nullable: true })
    to_model?: string;

    @Column({ nullable: true })
    to_id?: number;

    @Column()
    readable: string;

    @Column({ type: 'json' })
    data?: object;

    @CreateDateColumn()
    createdDate?: Date;

    @UpdateDateColumn()
    updatedDate?: Date;
}
