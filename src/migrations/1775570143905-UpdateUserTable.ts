import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable1775570143905 implements MigrationInterface {
  name = 'UpdateUserTable1775570143905';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "first_name" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_name" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "firebase_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "firebase_id" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
  }
}
