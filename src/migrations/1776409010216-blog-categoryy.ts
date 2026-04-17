import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlogCategoryy1776409010216 implements MigrationInterface {
  name = 'BlogCategoryy1776409010216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" ALTER COLUMN "cover_image" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" ALTER COLUMN "cover_image" DROP NOT NULL`,
    );
  }
}
