import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDateColumnTypes1754561252671 implements MigrationInterface {
    name = 'UpdateDateColumnTypes1754561252671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price" DROP COLUMN "priceAt"`);
        await queryRunner.query(`ALTER TABLE "price" ADD "priceAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game-round" DROP COLUMN "roundStartAt"`);
        await queryRunner.query(`ALTER TABLE "game-round" ADD "roundStartAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game-round" DROP COLUMN "roundEndAt"`);
        await queryRunner.query(`ALTER TABLE "game-round" ADD "roundEndAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game-round" DROP COLUMN "roundEndAt"`);
        await queryRunner.query(`ALTER TABLE "game-round" ADD "roundEndAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game-round" DROP COLUMN "roundStartAt"`);
        await queryRunner.query(`ALTER TABLE "game-round" ADD "roundStartAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "price" DROP COLUMN "priceAt"`);
        await queryRunner.query(`ALTER TABLE "price" ADD "priceAt" TIMESTAMP NOT NULL`);
    }

}
