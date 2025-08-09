import { Injectable } from '@nestjs/common';
import { User } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.userRepository.findOne(options);
  }

  async createAnonymousUser(): Promise<UserEntity> {
    const uuid = uuidv4();

    return this.userRepository.save(
      this.userRepository.create({
        uuid,
      }),
    );
  }
}
