import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGameTableAndUpdatingGameRoundTable1754506626013 implements MigrationInterface {
    name = 'CreateGameTableAndUpdatingGameRoundTable1754506626013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bf9d3d4a1098e42eefe75c7b4b"`);
        await queryRunner.query(`CREATE TYPE "public"."game_marketpair_enum" AS ENUM('btcusd')`);
        await queryRunner.query(`CREATE TYPE "public"."game_status_enum" AS ENUM('ongoing', 'concluded')`);
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "marketPair" "public"."game_marketpair_enum" NOT NULL, "status" "public"."game_status_enum" NOT NULL, "points" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "game-round" ADD "gameId" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game-round" DROP COLUMN "gameId"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TYPE "public"."game_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."game_marketpair_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_bf9d3d4a1098e42eefe75c7b4b" ON "game-round" ("createdAt") `);
    }

}
