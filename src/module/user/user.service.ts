import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByGoogleId(google_id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { google_id } });
  }

  async findByFirebaseId(firebase_id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { firebase_id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }
}
