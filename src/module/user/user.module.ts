import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { Blog } from '../blog/entity/blog.entity';

import { FirebaseModule } from '../firebase/firebase.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Blog]),
    FirebaseModule,
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService, FileUploadService],
  exports: [UserService],
})
export class UserModule {}
