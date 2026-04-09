import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlogTable1775648729088 implements MigrationInterface {
  name = 'BlogTable1775648729088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."blogs_status_enum" AS ENUM('draft', 'published')`,
    );
    await queryRunner.query(
      `CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying(255) NOT NULL, "content" text NOT NULL, "slug" character varying(255) NOT NULL, "status" "public"."blogs_status_enum" NOT NULL DEFAULT 'draft', "published_at" TIMESTAMP NOT NULL, "author_id" uuid, CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7" UNIQUE ("slug"), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_b324119dcb71e877cee411f7929" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_b324119dcb71e877cee411f7929"`,
    );
    await queryRunner.query(`DROP TABLE "blogs"`);
    await queryRunner.query(`DROP TYPE "public"."blogs_status_enum"`);
  }
}
