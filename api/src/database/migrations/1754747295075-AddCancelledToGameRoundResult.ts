import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCancelledToGameRoundResult1754747295075 implements MigrationInterface {
    name = 'AddCancelledToGameRoundResult1754747295075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."game-round_result_enum" RENAME TO "game-round_result_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."game-round_result_enum" AS ENUM('won', 'lost', 'waiting', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "game-round" ALTER COLUMN "result" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "game-round" ALTER COLUMN "result" TYPE "public"."game-round_result_enum" USING "result"::"text"::"public"."game-round_result_enum"`);
        await queryRunner.query(`ALTER TABLE "game-round" ALTER COLUMN "result" SET DEFAULT 'waiting'`);
        await queryRunner.query(`DROP TYPE "public"."game-round_result_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."game-round_result_enum_old" AS ENUM('won', 'lost', 'waiting')`);
        await queryRunner.query(`ALTER TABLE "game-round" ALTER COLUMN "result" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "game-round" ALTER COLUMN "result" TYPE "public"."game-round_result_enum_old" USING "result"::"text"::"public"."game-round_result_enum_old"`);
        await queryRunner.query(`ALTER TABLE "game-round" ALTER COLUMN "result" SET DEFAULT 'waiting'`);
        await queryRunner.query(`DROP TYPE "public"."game-round_result_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."game-round_result_enum_old" RENAME TO "game-round_result_enum"`);
    }

}
