import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceEntity } from './entities/price.entity';
import { PriceController } from './price.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PriceEntity])],
    controllers: [PriceController],
    providers: [PriceService],
    exports: [PriceService, TypeOrmModule],
})
export class PriceModule {}