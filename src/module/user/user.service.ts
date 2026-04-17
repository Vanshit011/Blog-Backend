import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

import { FileUploadService } from './file-upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileUploadService: FileUploadService,
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

  async findByIdOrUsername(identifier: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: identifier })
      .orWhere('user.user_name = :user_name', { user_name: identifier })
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.display_name',
        'user.profile_picture',
        'user.about',
        'user.user_name',
        'user.created_at',
      ])
      .getOne();

    return user || null;
  }

  async uploadProfilePicture(userId: string, file: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const folder = 'profile-pictures';
    const profile_picture = await this.fileUploadService.uploadFile(
      file,
      folder,
    );

    return this.update(userId, { profile_picture });
  }
}
