import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('testimonials') export class Testimonial {
 @PrimaryGeneratedColumn('uuid') id!: string; @Column() name!: string; @Column({ type: 'varchar', nullable: true }) designation!: string | null;
 @Column({ type: 'text' }) quote!: string; @Column({ name: 'avatar_url', type: 'text', nullable: true }) avatarUrl!: string | null;
 @Column({ default: 5 }) rating!: number; @Column({ default: 'pending' }) status!: string; @Column({ name: 'sort_order', default: 0 }) sortOrder!: number;
 @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}
