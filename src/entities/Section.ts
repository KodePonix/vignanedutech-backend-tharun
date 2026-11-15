import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
@Entity('sections') @Index(['slug'], { unique: true }) export class Section {
 @PrimaryGeneratedColumn('uuid') id!: string; @Column() slug!: string; @Column() title!: string;
 @Column({ name: 'section_type' }) sectionType!: string; @Column({ type: 'jsonb', default: () => "'{}'::jsonb" }) content!: Record<string, unknown>;
 @Column({ name: 'sort_order', default: 0 }) sortOrder!: number; @Column({ name: 'is_visible', default: true }) isVisible!: boolean;
 @Column({ default: 'draft' }) status!: string; @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}
