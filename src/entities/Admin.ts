import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('admins') export class Admin {
 @PrimaryGeneratedColumn('uuid') id!: string;
 @Column() name!: string;
 @Column({ unique: true }) email!: string;
 @Column({ name: 'password_hash', select: false }) passwordHash!: string;
 @Column({ default: 'admin' }) role!: string;
 @Column({ name: 'is_active', default: true }) isActive!: boolean;
 @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}
