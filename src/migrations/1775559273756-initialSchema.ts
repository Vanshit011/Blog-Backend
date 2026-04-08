import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1775559273756 implements MigrationInterface {
  name = 'InitialSchema1775559273756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "google_id" character varying(255), "firebase_id" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "display_name" character varying(255), "photo_url" character varying(255), "last_login" TIMESTAMP, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id"), CONSTRAINT "UQ_22468a1f8e15721c1a02fb1127c" UNIQUE ("firebase_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
