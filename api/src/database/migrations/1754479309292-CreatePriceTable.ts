import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePriceTable1754479309292 implements MigrationInterface {
    name = 'CreatePriceTable1754479309292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."price_marketpair_enum" AS ENUM('btcusd')`);
        await queryRunner.query(`CREATE TABLE "price" ("id" SERIAL NOT NULL, "marketPair" "public"."price_marketpair_enum" NOT NULL, "price" character varying NOT NULL, "priceAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "price"`);
        await queryRunner.query(`DROP TYPE "public"."price_marketpair_enum"`);
    }

}
