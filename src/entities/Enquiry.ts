import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('enquiries') export class Enquiry {
 @PrimaryGeneratedColumn('uuid') id!: string; @Column() name!: string; @Column() email!: string; @Column({ type: 'varchar', nullable: true }) phone!: string | null;
 @Column({ type: 'varchar', nullable: true }) organization!: string | null; @Column({ type: 'varchar', nullable: true }) subject!: string | null; @Column({ type: 'text' }) message!: string;
 @Column({ default: 'new' }) status!: string; @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}
