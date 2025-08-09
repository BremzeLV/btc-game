import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateUserIdColumns1754702180148 implements MigrationInterface {
    name = 'GenerateUserIdColumns1754702180148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game-round" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD "userId" uuid NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "game-round" DROP COLUMN "userId"`);
    }

}
