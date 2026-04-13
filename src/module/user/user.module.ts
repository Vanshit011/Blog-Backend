import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { BlogModule } from '../blog/blog.module';
import { Blog } from '../blog/entity/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blog]), BlogModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
