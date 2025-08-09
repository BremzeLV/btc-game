import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGameRoundTable1754528172293 implements MigrationInterface {
    name = 'UpdateGameRoundTable1754528172293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game-round" ADD "roundStartAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game-round" ADD "roundEndAt" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game-round" DROP COLUMN "roundEndAt"`);
        await queryRunner.query(`ALTER TABLE "game-round" DROP COLUMN "roundStartAt"`);
    }

}
