import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntityUpdate1776402155433 implements MigrationInterface {
  name = 'UserEntityUpdate1776402155433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "photo_url" TO "profile_picture"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "profile_picture" TO "photo_url"`,
    );
  }
}
