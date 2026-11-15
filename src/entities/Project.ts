import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('projects') export class Project {
 @PrimaryGeneratedColumn('uuid') id!: string; @Column() title!: string; @Column({ type: 'text', nullable: true }) description!: string | null;
 @Column({ default: 'Robotics' }) category!: string; @Column({ name: 'image_url', type: 'text', nullable: true }) imageUrl!: string | null;
 @Column({ name: 'grade_label', type: 'varchar', nullable: true }) gradeLabel!: string | null; @Column({ type: 'jsonb', default: () => "'[]'::jsonb" }) gallery!: string[];
 @Column({ name: 'sort_order', default: 0 }) sortOrder!: number; @Column({ name: 'is_published', default: false }) isPublished!: boolean;
 @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}
