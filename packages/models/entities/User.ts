import { hash } from 'bcryptjs';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  //    OneToMany,
  UpdateDateColumn,
} from 'typeorm';
// import { Room } from './Room';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ nullable: true })
  username: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'normal' })
  tag: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  attachments: string;

  @Column({ nullable: true })
  unique_import_id?: string;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  parentId: number;

  @Column({ nullable: true })
  referral_commission: number;

  /*  @Column({ nullable: true })
    usersReferred: number;

    @Column({ nullable: true })
    pokerDeals: number;

    @Column({ nullable: true })
    rake: number;

    @Column({ nullable: true })
    rakeBack: number;

    @Column({ nullable: true })
    netRakeBack: number;

    @Column({ nullable: true })
    commissions: number;

    @Column({ nullable: true })
    earnings: number;

    @Column({ nullable: true })
    payments: number;
  */

  @Column({ nullable: true })
  balance: number;

  @Column({ nullable: true, default: true })
  canLogin: boolean;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  billing: string;

  @Column({ nullable: false, default: false })
  is_disabled: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  async setPassword(newPassword: string) {
    this.password = await hash(newPassword, 10);
  }

  @BeforeInsert()
  async encryptPassword() {
    this.password = await hash(this.password, 10);
  }
}
