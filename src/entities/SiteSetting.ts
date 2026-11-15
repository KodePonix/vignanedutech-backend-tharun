import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';
@Entity('site_settings') export class SiteSetting {
 @PrimaryGeneratedColumn('uuid') id!: string; @Column({ unique: true }) key!: string;
 @Column({ type: 'jsonb', default: () => "'{}'::jsonb" }) value!: Record<string, unknown>; @UpdateDateColumn() updatedAt!: Date;
}
