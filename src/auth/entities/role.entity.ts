import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar', { length: 50, unique: true })
  name: string;
  @Column('varchar', { length: 100, nullable: true })
  description: string;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  //Relations
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
