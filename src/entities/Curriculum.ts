import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('curriculum') export class Curriculum {
 @PrimaryGeneratedColumn('uuid') id!: string; @Column() title!: string; @Column({ name: 'grade_label', type: 'varchar', nullable: true }) gradeLabel!: string | null;
 @Column({ name: 'file_url', type: 'text' }) fileUrl!: string; @Column({ name: 'file_name', type: 'varchar', nullable: true }) fileName!: string | null;
 @Column({ type: 'text', nullable: true }) description!: string | null; @Column({ name: 'sort_order', default: 0 }) sortOrder!: number;
 @Column({ name: 'is_published', default: false }) isPublished!: boolean; @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}
