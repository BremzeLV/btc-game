import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1754874166097 implements MigrationInterface {
    name = 'AddIndexes1754874166097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_a581faab8ea89ce34a358e9d6e" ON "price" ("marketPair") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8106c0a84d70ecfc3358301c5" ON "game" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1f2f5fed6227e9266b8e6f4040" ON "game" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_9aec79c51ae9443b36d4129c2c" ON "game" ("marketPair") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a2c9dce6ef46028f374b3ef2b" ON "game-round" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b9c567c781c87ed9fcaadc45b3" ON "game-round" ("gameId") `);
        await queryRunner.query(`CREATE INDEX "IDX_804466349f59f654c3ffc3d9cc" ON "game-round" ("result") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_804466349f59f654c3ffc3d9cc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9c567c781c87ed9fcaadc45b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8a2c9dce6ef46028f374b3ef2b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9aec79c51ae9443b36d4129c2c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f2f5fed6227e9266b8e6f4040"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8106c0a84d70ecfc3358301c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a581faab8ea89ce34a358e9d6e"`);
    }

}
