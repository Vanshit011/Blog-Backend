import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoverImageBlog1775809878554 implements MigrationInterface {
  name = 'AddCoverImageBlog1775809878554';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD "cover_image" character varying(500)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "cover_image"`);
  }
}
