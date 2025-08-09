import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGameTableAndUpdatingGameRoundTable1754507897780 implements MigrationInterface {
    name = 'CreateGameTableAndUpdatingGameRoundTable1754507897780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "status" SET DEFAULT 'ongoing'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
