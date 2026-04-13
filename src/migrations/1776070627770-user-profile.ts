import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserProfile1776070627770 implements MigrationInterface {
  name = 'UserProfile1776070627770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "about" text`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "about"`);
  }
}
