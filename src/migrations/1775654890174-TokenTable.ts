import { MigrationInterface, QueryRunner } from 'typeorm';

export class TokenTable1775654890174 implements MigrationInterface {
  name = 'TokenTable1775654890174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token" text NOT NULL, "expires_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`,
    );
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
