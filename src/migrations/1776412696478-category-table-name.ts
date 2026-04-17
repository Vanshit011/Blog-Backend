import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryTableName1776412696478 implements MigrationInterface {
  name = 'CategoryTableName1776412696478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_fdbc13fadcd030029694ebd4b9e"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "blogId"`);
    await queryRunner.query(`ALTER TABLE "blogs" ADD "category_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`,
    );
    await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "category_id"`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "blogId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_fdbc13fadcd030029694ebd4b9e" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
