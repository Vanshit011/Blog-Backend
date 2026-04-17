import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlogCategory1776408984153 implements MigrationInterface {
  name = 'BlogCategory1776408984153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD "category" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "category"`);
  }
}
