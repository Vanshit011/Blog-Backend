import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePublishedDate1775653564009 implements MigrationInterface {
  name = 'RemovePublishedDate1775653564009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "published_at"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD "published_at" TIMESTAMP NOT NULL`,
    );
  }
}
