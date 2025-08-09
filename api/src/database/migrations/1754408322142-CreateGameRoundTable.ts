import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGameRoundTable1754408322142 implements MigrationInterface {
    name = 'CreateGameRoundTable1754408322142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."game-round_prediction_enum" AS ENUM('up', 'down')`);
        await queryRunner.query(`CREATE TYPE "public"."game-round_result_enum" AS ENUM('won', 'lost', 'waiting')`);
        await queryRunner.query(`CREATE TABLE "game-round" ("id" SERIAL NOT NULL, "prediction" "public"."game-round_prediction_enum" NOT NULL, "result" "public"."game-round_result_enum" NOT NULL DEFAULT 'waiting', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_bcdef4217cab2a5396d9ee72879" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bf9d3d4a1098e42eefe75c7b4b" ON "game-round" ("createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bf9d3d4a1098e42eefe75c7b4b"`);
        await queryRunner.query(`DROP TABLE "game-round"`);
        await queryRunner.query(`DROP TYPE "public"."game-round_result_enum"`);
        await queryRunner.query(`DROP TYPE "public"."game-round_prediction_enum"`);
    }

}
