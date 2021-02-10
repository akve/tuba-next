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
export class Collection extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id?: number;

    @Column({nullable: false})
    code: string;

    @Column({nullable: false})
    name: string;

    @Column({nullable: true})
    parent: string;

    @Column({ nullable: true })
    image: string;

    @Column({ type: 'json' })
    data?: object;

    @CreateDateColumn()
    createdDate?: Date;

    @UpdateDateColumn()
    updatedDate?: Date;
}
