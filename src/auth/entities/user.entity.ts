import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar', { length: 100, unique: true })
  email: string;
  @Column('varchar', { length: 255, select: false })
  password: string;
  @Column('varchar', { length: 100 })
  name: string;
  @Column('varchar', { length: 100 })
  lastName: string;
  @Column('varchar', { length: 20, nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  address: string;
  @Column('bool', { default: true, name: 'is_active' })
  isActive: boolean;
  //Relations
  @Column()
  roleId: string;
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
