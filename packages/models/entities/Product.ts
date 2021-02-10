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
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id?: number;

    @Column()
    code: string;

    @Column({nullable: true})
    name: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true, type: 'float' })
    price: number;


    @Column({ nullable:true })
    description: string;

    @Column({nullable: true})
    invisible: boolean;

    @Column({nullable: true, type: 'float'})
    sorter: number;

    @Column({ type: 'json' })
    data?: object;

    @CreateDateColumn()
    createdDate?: Date;

    @UpdateDateColumn()
    updatedDate?: Date;
}
